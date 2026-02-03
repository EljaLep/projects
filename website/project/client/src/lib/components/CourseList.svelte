<script>

  import { useCoursesState } from "$lib/states/courseState.svelte.js";
    import CourseItem from "./CourseItem.svelte";
  let coursesState = useCoursesState();

</script>

<nav>
  <ul class="space-y-4">
    {#each coursesState.courses as course}
      <li>
        <CourseItem { course } />
      </li>
    {/each}
  </ul>
</nav>