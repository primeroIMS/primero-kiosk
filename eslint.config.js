import stylistic from "@stylistic/eslint-plugin";
import eslintParserTypeScript from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginBetterTailwind from "eslint-plugin-better-tailwindcss";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";

const PRINT_WIDTH = 90;

export default [
    {
        files: ["**/*.{ts,tsx,cts,mts}"],
        languageOptions: {
            parser: eslintParserTypeScript,
            parserOptions: {
                project: true,
            },
        },
    },
    { ignores: ["dist"] },
    perfectionist.configs["recommended-alphabetical"],
    eslintConfigPrettier,
    stylistic.configs.customize({
        indent: 4,
        jsx: true,
        quotes: "single",
        semi: true,
    }),
    {
        files: ["**/*.{jsx,tsx,ts,js}"],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            "better-tailwindcss": eslintPluginBetterTailwind,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "unused-imports": unusedImports,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "@stylistic/comma-dangle": ["error", "never"],
            "@stylistic/function-paren-newline": ["error", "multiline-arguments"],
            "@stylistic/jsx-max-props-per-line": [1, { maximum: 1 }],
            "@stylistic/jsx-one-expression-per-line": "error",
            "@stylistic/max-len": ["error", { code: PRINT_WIDTH }],
            "@stylistic/object-property-newline": "error",
            "@typescript-eslint/no-unused-vars": "off",
            "better-tailwindcss/enforce-consistent-class-order": [
                "warn",
                { order: "official" },
            ],
            "better-tailwindcss/enforce-consistent-line-wrapping": [
                "warn",
                { preferSingleLine: true, printWidth: PRINT_WIDTH, strictness: "loose" },
            ],
            "better-tailwindcss/no-duplicate-classes": "error",
            "better-tailwindcss/no-unnecessary-whitespace": "error",
            "object-curly-spacing": ["error", "always"],
            "perfectionist/sort-imports": [
                "error",
                {
                    customGroups: [],
                    environment: "node",
                    groups: [
                        "type-import",
                        ["value-builtin", "value-external"],
                        "type-internal",
                        "value-internal",
                        ["type-parent", "type-sibling", "type-index"],
                        ["value-parent", "value-sibling", "value-index"],
                        "ts-equals-import",
                        "unknown",
                    ],
                    ignoreCase: true,
                    internalPattern: ["^@/.+"],
                    maxLineLength: undefined,
                    newlinesBetween: 1,
                    order: "asc",
                    partitionByComment: false,
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    type: "alphabetical",
                },
            ],
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
            "unused-imports/no-unused-imports": "error",
        },
        settings: {
            "better-tailwindcss": {
                entryPoint: "app/frontend/app.css",
            },
        },
    },
    eslintPluginPrettierRecommended,
];
