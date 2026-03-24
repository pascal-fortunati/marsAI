import { findCatalogueFilms } from "./src/models/catalogueModel.js";

try {
  const data = await findCatalogueFilms({ page: 1, perPage: 20, category: null, q: null });
  console.log(JSON.stringify(data, null, 2));
} catch (error) {
  console.error("MODEL_ERROR", error);
}
