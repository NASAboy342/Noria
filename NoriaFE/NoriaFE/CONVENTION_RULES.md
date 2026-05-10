# Convention Rules

## Model Owns API Payload Shape

### Rule
When sending data to an API, the request payload shape must be defined and controlled by the domain model, not by API/composable functions.

### Required Implementation Pattern
1. Define a payload contract near the model (for example, `AddBuildingPayload`).
2. Add a serializer method on the model (for example, `toAddBuildingPayload()`).
3. In composables/services, send serialized model output directly.

### Example
```ts
// model
export interface AddBuildingPayload {
  name: string;
  address: string;
  img: string;
  rooms: number;
  occupiedRooms: number;
  paidRooms: number;
  floors: number;
  electricityPricePerUnit: number;
  waterPricePerUnit: number;
}

export class Building {
  // fields...

  toAddBuildingPayload(): AddBuildingPayload {
    return {
      name: this.name,
      address: this.address,
      img: this.img,
      rooms: this.rooms,
      occupiedRooms: this.occupiedRooms,
      paidRooms: this.paidRooms,
      floors: this.floors,
      electricityPricePerUnit: this.electricityPricePerUnit,
      waterPricePerUnit: this.waterPricePerUnit,
    };
  }
}

// composable/service
await fetch("https://noriabe.ppiinn.net/System/add-building", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(building.toAddBuildingPayload()),
});
```

### Why
- Keeps API contracts centralized and consistent.
- Avoids duplicated mapping logic across composables.
- Makes refactors safer when model fields change.
- Improves type safety and readability.

### Do
- Keep transformation logic in the model.
- Reuse serializer methods in all API calls.
- Convert plain objects into model instances when model methods are needed.

### Do Not
- Build ad-hoc payload objects inside composables/services for model-owned data.
- Duplicate the same field mapping in multiple places.

---

## Global API Helpers (`apiGet` / `apiPost`)

### Rule
All HTTP calls to the Noria backend must go through the `apiGet` and `apiPost` helpers exposed by `useApi`. Never write raw `fetch` calls inside composables or components.

### Required Implementation Pattern
- Use `apiGet<T>(path)` for GET requests.
- Use `apiPost<T>(path, payload)` for POST requests.
- Both helpers automatically handle error extraction and message reporting; do not duplicate that logic.

### Example
```ts
// inside useApi()
const buildings = await apiGet<Building[]>('/System/buildings')
await apiPost('/System/add-building', building.toAddBuildingPayload())
```

### Why
- Centralises error handling and success/failure message reporting.
- Prevents duplicated fetch boilerplate across the codebase.

### Do
- Always pass a path relative to `API_BASE_URL` (e.g. `'/System/add-building'`).
- Use the generic type parameter so the return type is inferred correctly.

### Do Not
- Call `fetch` directly outside of `apiGet`/`apiPost`.
- Handle `response.ok` checks manually in feature code.

---

## API Result Messages via Pinia Message Store

### Rule
After every API call, a result message must be stored using `SetMessage(message, level)` from the `useMessageStore` Pinia store. This is already done automatically by `apiGet`/`apiPost` on error; callers must add a success message manually after a successful call.

### Message Levels
| Level   | When to use                        |
|---------|------------------------------------|
| `info`  | Successful API response            |
| `error` | Failed API response / thrown error |

### Error Message Priority
When the API returns an error response, first check if the response body contains a `message` property (string). If present, use it as the error message; otherwise fall back to `"<METHOD> <path> failed: <status> <statusText>"`.

### Store Behaviour
- Messages are stored in `useMessageStore` (`src/stores/messageStore.ts`).
- A scheduler runs every second and removes messages older than **10 seconds**.
- The `DesktopLayout` popup reactively reflects the current message list.

### Example
```ts
// success message after apiPost
await apiPost('/System/add-building', building.toAddBuildingPayload())
messageStore.SetMessage('Building added successfully', 'info')

// error is handled automatically by apiPost — no extra code needed
```

### Do
- Call `SetMessage` with `'info'` level after every successful operation.
- Let `apiGet`/`apiPost` handle error messages — do not duplicate them.

### Do Not
- Call `SetMessage` twice for the same error (the helper already does it).
- Use `console.error` as a substitute for `SetMessage`.
