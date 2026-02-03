<script>
  import { useUserState } from "$lib/states/userState.svelte.js";
  import "../app.css";
  let { children, data } = $props();
  const userState = useUserState();
  if (data.user) {
    userState.user = data.user;
  }

  $effect(( ) => {
    console.log("hello from layout svelte")
    console.log(data.user);
    document.body.classList.add("e2e-ready");
  })

  
</script>

<div class="flex flex-col h-full">

  <header class="bg-primary-100 p-4 mb-6">
    <h1 class="text-xl text-primary-1000 text-center">Course application</h1>
    <nav>
      <ul class="flex space-x-4">
        <li><a href="/" class="anchor text-primary-400">Home</a></li>
        <li><a href="/courses" class="anchor text-primary-400">Courses</a></li>
      </ul>
    </nav>
  </header>


  <main class="container mx-auto max-w-2xl grow">
    {#if data.user?.email}
      <p>{data.user?.email}</p>
    {/if}
    {@render children()}
  </main>

  <footer class="p-4 border-t-1 border-gray-300">

    <p class="text-center">this is a footer</p>
  </footer>
</div>


