<script>
  let { course } = $props();
</script>

<div class="card border-[2px] p-4 border-gray-300">
  <a class="anchor text-center" href="/courses/{course.id}">{course.name}</a>
</div>
