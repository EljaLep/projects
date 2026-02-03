<script>
  let { data, form } = $props();
</script>

<h2 class="text-xl pb-4">
  {data.action === "login" ? "Login" : "Register"} form
</h2>

{#if form?.message}
  <p class="text-xl">{form.message}</p>
{/if}

{#if data.registered}
  <p class="text-xl">
    You have successfully registered. Please login to continue.
  </p>
{/if}

<form class="space-y-4" method="POST" action="?/{data.action}">
  <label class="label" for="email">
    <span class="label-text">Email</span>
    <input
      class="input"
      id="email"
      name="email"
      type="email"
      placeholder="Email"
    />
  </label>
  <label class="label" for="password">
    <span class="label-text">Password</span>
    <input class="input" id="password" name="password" type="password" />
  </label>
  <button class="w-full btn preset-filled-primary-500" type="submit">
    {data.action === "login" ? "Login" : "Register"}
  </button>
</form>