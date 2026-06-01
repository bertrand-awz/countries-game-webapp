<script setup lang="ts">
  import type { GeoPath, GeoProjection } from "d3";
  import * as d3 from "d3";
  import { onMounted, ref, watch } from "vue";

  import type { Country } from "@/domain/game/models/Country";

  const props = withDefaults(
    defineProps<{
      countries: Country[];
      highlightedCountryId?: string | null;
      width?: number;
      height?: number;
    }>(),
    {
      highlightedCountryId: null,
      width: 700,
      height: 700,
    },
  );

  const emit = defineEmits<{
    "update:highlightedCountryId": [countryId: string | null];
  }>();

  const svgElement = ref<SVGSVGElement | null>(null);

  let projection: GeoProjection;
  let pathGenerator: GeoPath;
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  let globeGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  let countryPaths: d3.Selection<SVGPathElement, Country, SVGGElement, unknown>;

  function getCountryId(country: Country): string {
    return country.id || country.properties.id;
  }

  function initializeGlobe(): void {
    if (!svgElement.value) return;

    const width = props.width;
    const height = props.height;

    svg = d3.select(svgElement.value);
    svg.selectAll("*").remove();

    projection = d3
      .geoOrthographic()
      .scale(Math.min(width, height) / 2.25)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    pathGenerator = d3.geoPath(projection);

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Interactive world globe");

    svg
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", projection.scale())
      .attr("fill", "#0f172a")
      .attr("stroke", "#334155")
      .attr("stroke-width", 1.5);

    globeGroup = svg.append("g");

    renderCountries();
    enableDragRotation();

    if (props.highlightedCountryId) {
      highlightCountry(props.highlightedCountryId, false);
    }
  }

  function renderCountries(): void {
    countryPaths = globeGroup
      .selectAll<SVGPathElement, Country>("path")
      .data(props.countries, (country) => getCountryId(country))
      .join("path")
      .attr("d", pathGenerator)
      .attr("fill", (country) => getCountryFill(getCountryId(country)))
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 0.5)
      .attr("cursor", "pointer")
      .on("click", (_event, country) => {
        const countryId = getCountryId(country);

        emit("update:highlightedCountryId", countryId);
        highlightCountry(countryId, true);
      })
      .on("mouseenter", function () {
        d3.select(this).attr("fill", "#818cf8");
      })
      .on("mouseleave", function (_event, country) {
        d3.select(this).attr("fill", getCountryFill(getCountryId(country)));
      });
  }

  function getCountryFill(countryId: string): string {
    if (countryId === props.highlightedCountryId) {
      return "#facc15";
    }

    return "#475569";
  }

  function updateCountryColors(): void {
    if (!countryPaths) return;

    countryPaths
      .transition()
      .duration(250)
      .attr("fill", (country) => getCountryFill(getCountryId(country)))
      .attr("stroke", (country) =>
        getCountryId(country) === props.highlightedCountryId ? "#fef3c7" : "#1e293b",
      )
      .attr("stroke-width", (country) =>
        getCountryId(country) === props.highlightedCountryId ? 1.5 : 0.5,
      );
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
      .transition()
      .duration(180)
      .attr("stroke-width", 4)
      .transition()
      .duration(250)
      .attr("stroke-width", 1.5);
  }

  function enableDragRotation(): void {
    let previousX = 0;
    let previousY = 0;

    const dragBehavior = d3
      .drag<SVGSVGElement, unknown>()
      .on("start", (event) => {
        previousX = event.x;
        previousY = event.y;
      })
      .on("drag", (event) => {
        const rotation = projection.rotate();

        const deltaX = event.x - previousX;
        const deltaY = event.y - previousY;

        projection.rotate([rotation[0] + deltaX * 0.35, rotation[1] - deltaY * 0.35, rotation[2]]);

        previousX = event.x;
        previousY = event.y;

        countryPaths.attr("d", pathGenerator);
      });

    svg.call(dragBehavior);
  }

  onMounted(() => {
    initializeGlobe();
  });

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
</script>

<template>
  <div class="globe-container">
    <svg ref="svgElement" class="globe-svg"></svg>
  </div>
</template>

<style scoped>
  .globe-container {
    width: 100%;
    max-width: 700px;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .globe-svg {
    width: 100%;
    height: 100%;
    touch-action: none;
    user-select: none;
  }
</style>
