import js from "@eslint/js"
import prettier from "eslint-config-prettier"
import importX from "eslint-plugin-import-x"
import n from "eslint-plugin-n"
import promise from "eslint-plugin-promise"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    ignores: ["build/**", "node_modules/**"],
  },

  js.configs.recommended,
  importX.flatConfigs.recommended,
  n.configs["flat/recommended-module"],
  promise.configs["flat/recommended"],

  // Regras validas para todos os arquivos.
  {
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      // A ordenacao fica com o simple-import-sort, para nao haver conflito.
      "import-x/order": "off",
      "no-console": "off",
      // Este projeto e uma aplicacao, nao um pacote publicado: importar
      // devDependencies em configs e testes e legitimo.
      "n/no-unpublished-import": "off",
      // Estas regras tentam parsear o codigo dos modulos importados dentro de
      // node_modules e falham em pacotes que usam sintaxe nova (import
      // attributes). O TypeScript ja valida default e named exports melhor.
      "import-x/no-named-as-default-member": "off",
      "import-x/no-named-as-default": "off",
      "import-x/namespace": "off",
      "import-x/default": "off",
      // Este e o entrypoint de uma aplicacao: encerrar o processo quando o
      // servidor nao consegue subir e o comportamento desejado.
      "n/no-process-exit": "off",
      // Permite o padrao .then(...).catch(...) sem exigir return no ultimo then.
      "promise/always-return": ["error", { ignoreLastCallback: true }],
    },
  },

  // Apenas TypeScript: lint com informacao de tipos.
  {
    files: ["**/*.ts"],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      importX.flatConfigs.typescript,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // O TypeScript ja garante que os imports resolvem; a regra do plugin n
      // nao entende o mapeamento .js -> .ts exigido por module: nodenext.
      "n/no-missing-import": "off",
    },
  },

  // Deve ser o ultimo: desliga as regras de estilo que conflitam com o prettier.
  prettier,
)
