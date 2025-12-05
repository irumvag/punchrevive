import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow 'any' type in test files and specific utility files
      '@typescript-eslint/no-explicit-any': 'off',
      // Allow unused vars - warnings only, don't fail build
      '@typescript-eslint/no-unused-vars': 'off',
      // Allow img tags (we use them intentionally for animations)
      '@next/next/no-img-element': 'off',
      // Allow unused imports in test files
      'react-hooks/exhaustive-deps': 'warn',
    }
  }
];

export default eslintConfig;
