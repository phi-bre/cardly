<script>
  import '../app.css';
  import { remote } from '../storage';

  $: collection = $remote.collection;
</script>

<slot />
