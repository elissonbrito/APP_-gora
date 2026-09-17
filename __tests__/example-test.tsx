import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

describe('Example Test', () => {
  test('Text renders correctly', () => {
    const { getByText } = render(<Text>Hello</Text>);
    getByText('Hello');
  });
});
