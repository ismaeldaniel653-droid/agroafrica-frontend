import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'

// ═══════════════════════════════════════════
// CONFIGURATION ESLINT
// ═══════════════════════════════════════════

export default [
  // ✅ Ignorer les dossiers de build
  {
    ignores: [
      'dist/**',
      'dev-dist/**',
      'node_modules/**',
      'public/sw.js',
      'build/**',
      'coverage/**',
      '*.min.js',
      '*.min.css',
    ],
  },

  // ✅ Configuration principale
  {
    files: ['**/*.{js,jsx}'],
    
    // ✅ Extensions
    extends: [
      js.configs.recommended,
      reactHooks.configs.recommended,
      react.configs.recommended,
      react.configs['jsx-runtime'], // ✅ Pour React 17+ avec JSX Transform
    ],

    // ✅ Options du langage
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        // ✅ Variables d'environnement Vite
        import: 'readonly',
        process: 'readonly',
        // ✅ Variables de test
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        test: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    // ✅ Plugins
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react': react,
    },

    // ✅ Règles
    rules: {
      // ═══ Règles générales ═══
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'no-param-reassign': ['error', { props: false }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'arrow-body-style': ['warn', 'as-needed'],
      
      // ═══ Règles React ═══
      'react/prop-types': 'off', // ✅ On utilise TypeScript ou PropTypes optionnels
      'react/react-in-jsx-scope': 'off', // ✅ React 17+ avec JSX Transform
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-key': ['error', { 
        checkFragmentShorthand: true,
        warnOnDuplicates: true,
      }],
      'react/no-array-index-key': 'warn',
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': 'error',
      'react/jsx-curly-brace-presence': ['warn', { 
        props: 'never', 
        children: 'never',
        propElementValues: 'always',
      }],
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-fragments': ['error', 'syntax'],

      // ═══ Règles React Hooks ═══
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': ['warn', {
        additionalHooks: '(useCallback|useMemo|useEffect|useRef)',
      }],

      // ═══ Règles React Refresh (Vite) ═══
      'react-refresh/only-export-components': ['warn', { 
        allowConstantExport: true,
        checkJSX: true,
      }],

      // ═══ Règles d'import ═══
      'no-duplicate-imports': 'error',
      'no-relative-imports': 'off', // Optionnel, désactivé par défaut
      'sort-imports': ['warn', {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      }],
    },

    // ✅ Paramètres React
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // ✅ Configuration pour les fichiers de test
  {
    files: ['**/*.test.js', '**/*.test.jsx', '**/*.spec.js', '**/*.spec.jsx'],
    rules: {
      'no-unused-vars': 'off',
      'no-console': 'off',
      'react/jsx-key': 'off',
    },
  },

  // ✅ Configuration pour les fichiers de configuration
  {
    files: [
      'vite.config.js',
      'eslint.config.js',
      '*.config.js',
      '*.config.cjs',
      '*.config.mjs',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'off',
    },
  },
]iu