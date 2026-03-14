import { act } from "react";
import { useCategoryStore } from "../store/categoryStore";

beforeEach(() => {
  useCategoryStore.setState({
    categories: [
      { id: "rotina", nome: "Rotina", cor: "#7F77DD" },
      { id: "trabalho", nome: "Trabalho", cor: "#D4537E" },
    ],
  });
});

describe("adicionar", () => {
  it("adiciona nova categoria", () => {
    act(() => useCategoryStore.getState().adicionar("Música"));
    expect(useCategoryStore.getState().categories).toHaveLength(3);
    expect(useCategoryStore.getState().categories[2].nome).toBe("Música");
  });
  it("ignora nome vazio", () => {
    act(() => useCategoryStore.getState().adicionar("   "));
    expect(useCategoryStore.getState().categories).toHaveLength(2);
  });
});

describe("editar", () => {
  it("edita nome da categoria", () => {
    act(() => useCategoryStore.getState().editar("rotina", "Rotina Diária"));
    expect(useCategoryStore.getState().categories[0].nome).toBe(
      "Rotina Diária",
    );
  });
  it("ignora nome vazio ao editar", () => {
    act(() => useCategoryStore.getState().editar("rotina", ""));
    expect(useCategoryStore.getState().categories[0].nome).toBe("Rotina");
  });
});

describe("remover", () => {
  it("remove categoria pelo id", () => {
    act(() => useCategoryStore.getState().remover("rotina"));
    expect(useCategoryStore.getState().categories).toHaveLength(1);
    expect(useCategoryStore.getState().categories[0].id).toBe("trabalho");
  });
  it("não afeta outras categorias", () => {
    act(() => useCategoryStore.getState().remover("rotina"));
    expect(useCategoryStore.getState().categories[0].nome).toBe("Trabalho");
  });
});
