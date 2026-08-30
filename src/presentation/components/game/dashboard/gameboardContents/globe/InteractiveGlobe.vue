<script setup lang="ts">
  import type {
    D3DragEvent,
    D3ZoomEvent,
    GeoPath,
    GeoProjection,
    ZoomBehavior,
    ZoomTransform,
  } from "d3";
  import * as d3 from "d3";
  import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

  import type { Country } from "@/domain/game/models/Country";
  import type { FoundCountry } from "@/domain/game/models/FoundCountry.ts";
  import { getPlayerColor } from "@/presentation/components/game/playerColorPalette.ts";

  const props = withDefaults(
    defineProps<{
      countries: Country[];
      highlightedCountryId?: string | null;
      foundCountries?: FoundCountry[];
      width?: number;
      height?: number;
    }>(),
    {
      highlightedCountryId: null,
      foundCountries: () => [],
      width: 700,
      height: 700,
    },
  );

  const globeContainerElement = ref<HTMLDivElement | null>(null);
  const svgElement = ref<SVGSVGElement | null>(null);
  const globeClipId = `interactive-globe-clip-${Math.random().toString(36).slice(2)}`;

  let projection: GeoProjection;
  let pathGenerator: GeoPath;
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  let globeClipCircle: d3.Selection<SVGCircleElement, unknown, null, undefined>;
  let globeBackground: d3.Selection<SVGCircleElement, unknown, null, undefined>;
  let globeGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  let countryPaths: d3.Selection<SVGPathElement, Country, SVGGElement, unknown>;
  let zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let baseProjectionScale = 0;
  let currentZoomTransform: ZoomTransform = d3.zoomIdentity;
  let viewportWidth = props.width;
  let viewportHeight = props.height;

  const MOUSE_ROTATION_SENSITIVITY = 0.35;
  const MIN_LATITUDE_ROTATION = -90;
  const MAX_LATITUDE_ROTATION = 90;
  const MIN_GLOBE_ZOOM_FACTOR = 1;
  const MAX_GLOBE_ZOOM_FACTOR = 5;
  const ZOOMED_IN_THRESHOLD = 1.01;
  const DEFAULT_COUNTRY_FILL_COLOR = "#475569";
  const HIGHLIGHTED_COUNTRY_FILL_COLOR = "#facc15";
  const DEFAULT_COUNTRY_STROKE_COLOR = "#1e293b";
  const HIGHLIGHTED_COUNTRY_STROKE_COLOR = "#fef3c7";
  const DEFAULT_COUNTRY_STROKE_WIDTH = 0.5;
  const FOUND_COUNTRY_STROKE_WIDTH = 1.4;
  const HIGHLIGHTED_COUNTRY_STROKE_WIDTH = 1.5;
  const HIGHLIGHTED_FOUND_COUNTRY_STROKE_WIDTH = 2.25;

  function getCountryId(country: Country): string {
    return country.id || country.properties.id;
  }

  function initializeGlobe({ preserveZoom = false }: { preserveZoom?: boolean } = {}): void {
    if (!svgElement.value) return;

    const { width, height } = getViewportSize();
    const nextZoomTransform = preserveZoom ? currentZoomTransform : d3.zoomIdentity;

    viewportWidth = width;
    viewportHeight = height;

    svg = d3.select(svgElement.value);
    svg.selectAll("*").remove();

    baseProjectionScale = getBaseProjectionScale(width, height);
    currentZoomTransform = constrainZoomTransform(nextZoomTransform);

    const [translateX, translateY] = getProjectionTranslate();

    projection = d3
      .geoOrthographic()
      .scale(baseProjectionScale * currentZoomTransform.k)
      .translate([translateX, translateY])
      .clipAngle(90);

    pathGenerator = d3.geoPath(projection);

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "World globe");

    globeClipCircle = svg
      .append("defs")
      .append("clipPath")
      .attr("id", globeClipId)
      .append("circle");

    globeBackground = svg
      .append("circle")
      .attr("fill", "#0f172a")
      .attr("stroke", "#334155")
      .attr("stroke-width", 1.5);

    globeGroup = svg.append("g").attr("clip-path", `url(#${globeClipId})`);

    updateGlobeBounds();

    renderCountries();
    enableMouseRotation();
    enableZoom();

    if (props.highlightedCountryId) {
      highlightCountry(props.highlightedCountryId, false);
    }
  }

  function getViewportSize(): { width: number; height: number } {
    const containerBounds = globeContainerElement.value?.getBoundingClientRect();

    return {
      width: Math.max(1, Math.round(containerBounds?.width || props.width)),
      height: Math.max(1, Math.round(containerBounds?.height || props.height)),
    };
  }

  function getBaseProjectionScale(width: number, height: number): number {
    return Math.min(width, height, props.width, props.height) / 2.25;
  }

  function renderCountries(): void {
    countryPaths = globeGroup
      .selectAll<SVGPathElement, Country>("path")
      .data(props.countries, (country) => getCountryId(country))
      .join("path")
      .attr("d", pathGenerator)
      .attr("fill", (country) => getCountryFill(getCountryId(country)))
      .attr("stroke", (country) => getCountryStroke(getCountryId(country)))
      .attr("stroke-width", (country) => getCountryStrokeWidth(getCountryId(country)));
  }

  function enableMouseRotation(): void {
    const mouseDrag = d3
      .drag<SVGSVGElement, unknown>()
      .filter((event: MouseEvent) => event.type === "mousedown" && event.button === 0)
      .touchable(false)
      .on("start", () => {
        svg.classed("globe-svg-dragging", true);
      })
      .on("drag", (event: D3DragEvent<SVGSVGElement, unknown, unknown>) => {
        if (shouldPanCameraFromMouseDrag(event)) {
          panCameraFromMouseDrag(event.dx, event.dy);
          return;
        }

        rotateGlobeFromMouseDrag(event.dx, event.dy);
      })
      .on("end", () => {
        svg.classed("globe-svg-dragging", false);
      });

    svg.call(mouseDrag);
  }

  function isCameraZoomedIn(): boolean {
    return currentZoomTransform.k > ZOOMED_IN_THRESHOLD;
  }

  function shouldPanCameraFromMouseDrag(
    event: D3DragEvent<SVGSVGElement, unknown, unknown>,
  ): boolean {
    return (
      isCameraZoomedIn() && event.sourceEvent instanceof MouseEvent && event.sourceEvent.shiftKey
    );
  }

  function panCameraFromMouseDrag(deltaX: number, deltaY: number): void {
    const nextZoomTransform = constrainZoomTransform(
      d3.zoomIdentity
        .translate(currentZoomTransform.x + deltaX, currentZoomTransform.y + deltaY)
        .scale(currentZoomTransform.k),
    );

    if (!zoomBehavior) {
      updateZoom(nextZoomTransform);
      return;
    }

    svg.call(zoomBehavior.transform, nextZoomTransform);
  }

  function enableZoom(): void {
    zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([MIN_GLOBE_ZOOM_FACTOR, MAX_GLOBE_ZOOM_FACTOR])
      .constrain((transform) => constrainZoomTransform(transform))
      .filter((event: Event) => {
        return event.type === "wheel" || event.type.startsWith("touch");
      })
      .on("zoom", (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        updateZoom(event.transform);
      });

    svg.call(zoomBehavior);
    svg.call(zoomBehavior.transform, currentZoomTransform);
    svg.on("dblclick.zoom", null);
  }

  function updateZoom(nextZoomTransform: ZoomTransform): void {
    currentZoomTransform = constrainZoomTransform(nextZoomTransform);
    projection.scale(baseProjectionScale * currentZoomTransform.k);
    projection.translate(getProjectionTranslate());
    updateGlobeBounds();
    countryPaths.attr("d", pathGenerator);
  }

  function constrainZoomTransform(zoomTransform: ZoomTransform): ZoomTransform {
    if (zoomTransform.k <= MIN_GLOBE_ZOOM_FACTOR) {
      return d3.zoomIdentity;
    }

    const globeRadius = baseProjectionScale * zoomTransform.k;
    const maxTranslateX = Math.max(0, globeRadius - viewportWidth / 2);
    const maxTranslateY = Math.max(0, globeRadius - viewportHeight / 2);

    return d3.zoomIdentity
      .translate(
        clamp(zoomTransform.x, -maxTranslateX, maxTranslateX),
        clamp(zoomTransform.y, -maxTranslateY, maxTranslateY),
      )
      .scale(zoomTransform.k);
  }

  function getProjectionTranslate(): [number, number] {
    return [
      viewportWidth / 2 + currentZoomTransform.x,
      viewportHeight / 2 + currentZoomTransform.y,
    ];
  }

  function updateGlobeBounds(): void {
    const [centerX, centerY] = getProjectionTranslate();
    const radius = projection.scale();

    globeClipCircle.attr("cx", centerX).attr("cy", centerY).attr("r", radius);
    globeBackground.attr("cx", centerX).attr("cy", centerY).attr("r", radius);
  }

  function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  function rotateGlobeFromMouseDrag(deltaX: number, deltaY: number): void {
    const [longitudeRotation, latitudeRotation, gammaRotation = 0] = projection.rotate();
    const rotationSensitivity = MOUSE_ROTATION_SENSITIVITY / currentZoomTransform.k;

    projection.rotate([
      longitudeRotation + deltaX * rotationSensitivity,
      clampLatitudeRotation(latitudeRotation - deltaY * rotationSensitivity),
      gammaRotation,
    ]);

    countryPaths.attr("d", pathGenerator);
    updateGlobeBounds();
  }

  function clampLatitudeRotation(latitudeRotation: number): number {
    return Math.max(MIN_LATITUDE_ROTATION, Math.min(MAX_LATITUDE_ROTATION, latitudeRotation));
  }

  function getCountryFill(countryId: string): string {
    const foundCountry = getFoundCountry(countryId);

    if (foundCountry) {
      return getPlayerColor(foundCountry.playerColorSlot);
    }

    if (countryId === props.highlightedCountryId) {
      return HIGHLIGHTED_COUNTRY_FILL_COLOR;
    }

    return DEFAULT_COUNTRY_FILL_COLOR;
  }

  function getCountryStroke(countryId: string): string {
    const foundCountry = getFoundCountry(countryId);

    if (foundCountry) {
      return getPlayerColor(foundCountry.playerColorSlot);
    }

    if (countryId === props.highlightedCountryId) {
      return HIGHLIGHTED_COUNTRY_STROKE_COLOR;
    }

    return DEFAULT_COUNTRY_STROKE_COLOR;
  }

  function getCountryStrokeWidth(countryId: string): number {
    const foundCountry = getFoundCountry(countryId);
    const isHighlighted = countryId === props.highlightedCountryId;

    if (foundCountry && isHighlighted) {
      return HIGHLIGHTED_FOUND_COUNTRY_STROKE_WIDTH;
    }

    if (foundCountry) {
      return FOUND_COUNTRY_STROKE_WIDTH;
    }

    if (isHighlighted) {
      return HIGHLIGHTED_COUNTRY_STROKE_WIDTH;
    }

    return DEFAULT_COUNTRY_STROKE_WIDTH;
  }

  function getFoundCountry(countryId: string): FoundCountry | undefined {
    return props.foundCountries.find((country) => country.countryId === countryId);
  }

  function updateCountryColors(): void {
    if (!countryPaths) return;

    countryPaths
      .interrupt()
      .transition()
      .duration(250)
      .attr("fill", (country) => getCountryFill(getCountryId(country)))
      .attr("stroke", (country) => getCountryStroke(getCountryId(country)))
      .attr("stroke-width", (country) => getCountryStrokeWidth(getCountryId(country)));
  }

  function highlightCountry(countryId: string | null, shouldAnimateRotation = true): void {
    if (!countryId) {
      updateCountryColors();
      return;
    }

    const country = props.countries.find(
      (currentCountry) => getCountryId(currentCountry) === countryId,
    );

    if (!country) {
      updateCountryColors();
      return;
    }

    if (!shouldAnimateRotation) {
      updateCountryColors();
      return;
    }

    rotateToCountry(country);
  }

  function rotateToCountry(country: Country): void {
    const [longitude, latitude] = d3.geoCentroid(country);
    const currentRotation = projection.rotate();
    const targetRotation: [number, number, number] = [-longitude, -latitude, 0];

    d3.transition()
      .duration(900)
      .tween("rotate", () => {
        const interpolator = d3.interpolate(currentRotation, targetRotation);

        return (progress) => {
          projection.rotate(interpolator(progress));
          countryPaths.attr("d", pathGenerator);
        };
      })
      .on("end", () => {
        updateCountryColors();
        pulseCountry(getCountryId(country));
      });
  }

  function pulseCountry(countryId: string): void {
    countryPaths
      .filter((country) => getCountryId(country) === countryId)
      .raise()
      .interrupt()
      .attr("fill", (country) => getCountryFill(getCountryId(country)))
      .attr("stroke", (country) => getCountryStroke(getCountryId(country)))
      .transition()
      .duration(180)
      .attr("stroke-width", 4)
      .transition()
      .duration(250)
      .attr("stroke", (country) => getCountryStroke(getCountryId(country)))
      .attr("stroke-width", (country) => getCountryStrokeWidth(getCountryId(country)));
  }

  onMounted(async () => {
    await nextTick();
    initializeGlobe();
    observeGlobeContainerSize();
  });

  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    resizeObserver = null;
  });

  function observeGlobeContainerSize(): void {
    if (!globeContainerElement.value) {
      return;
    }

    resizeObserver = new ResizeObserver(() => {
      initializeGlobe({ preserveZoom: true });
    });
    resizeObserver.observe(globeContainerElement.value);
  }

  watch(
    () => props.countries,
    () => {
      initializeGlobe();
    },
    { deep: true },
  );

  watch(
    () => props.highlightedCountryId,
    (newCountryId) => {
      highlightCountry(newCountryId, true);
    },
  );

  watch(
    () => props.foundCountries,
    () => {
      updateCountryColors();
    },
    { deep: true },
  );
</script>

<template>
  <div ref="globeContainerElement" class="globe-container">
    <svg ref="svgElement" class="globe-svg"></svg>
  </div>
</template>

<style scoped>
  .globe-container {
    width: 100%;
    height: 100%;
    min-height: min(700px, 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .globe-svg {
    width: 100%;
    height: 100%;
    touch-action: none;
    user-select: none;
    cursor: grab;
  }

  .globe-svg-dragging {
    cursor: grabbing;
  }
</style>
