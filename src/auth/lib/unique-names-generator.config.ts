import {
  adjectives,
  colors,
  Config,
  NumberDictionary,
} from 'unique-names-generator';

const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });

export const uniqueNamesGeneratorConfig: Config = {
  dictionaries: [adjectives, colors, numberDictionary],
  separator: '',
  length: 3,
};
