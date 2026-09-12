import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'test-results/**', 'public/vendor/**', '.vercel/**'] },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: {
      // Validators deliberately reject control characters in user input.
      'no-control-regex': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
];
