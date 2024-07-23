module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'avoid',
  proseWrap: 'always',
  endOfLine: 'lf',
  overrides: [
    {
      files: [
        'src/app/component/catalogo/saet/**/*.ts',
        'services/catalogo/catalogo.service.cor.ts',
      ],
      options: {
        // Aquí puedes definir opciones específicas para estos archivos si es necesario
      },
    },
  ],
};
