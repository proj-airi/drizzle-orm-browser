import antfu from '@antfu/eslint-config'

export default await antfu(
  {
    unocss: true,
    vue: true,
    toml: false,
    ignores: [
      'dist/**',
      'cspell.config.yaml',
      'cspell.config.yml',
    ],
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'type-builtin',
            'type-import',
            'value-builtin',
            'value-external',
            'type-internal',
            ['type-parent', 'type-sibling', 'type-index'],
            'value-internal',
            ['value-parent', 'value-sibling', 'value-index'],
            ['wildcard-value-parent', 'wildcard-value-sibling', 'wildcard-value-index'],
            'side-effect',
            'style',
          ],
          newlinesBetween: 'always',
        },
      ],
    },
  },
  {
    files: ['**/tsconfig.json'],
    rules: {
      'jsonc/sort-keys': 'off',
    },
  },
)
