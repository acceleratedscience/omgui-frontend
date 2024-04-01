# State + URL Query Synchronisation

Certain pages like the molecule grid have their state reflected in the URL query. The "single source of truth" is the state, which controls things like pagination, sorting, etc, so whenever the state changes, the URL query is updated with router.push(). This doesn't actually do anything other than record a history entry, as the route stays the same.

However, when the user goes back or forward in the browser history, we need to watch the url query and update the state accordingly, without it triggering another update to the URL. From the router's perspective, there's no difference between clicking on a link or pressing the back button.

The obvious solution to this would be to add a condition to the route watcher so the state only gets updated when it doesn't match the URL query. But there's an additional loop complicating things, because the UI components controlling the state (like searchbar, sort dropdown, etc.) are linked directly with the store's state via their v-model. So when the user goes back, and the state is updated with the values from the url query, this triggers the v-model values of the UI components to update, which in turn triggers a new store state change. So things get messy.

Without intervention this would happen:
- User goes back
- Watcher parses the URL query
- Store state is updated
- UI components are updated
- Store state is updated again


