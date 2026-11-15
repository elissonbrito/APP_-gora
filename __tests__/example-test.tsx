import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

describe('Example Test', () => {
  test('Text renders correctly', async () => {
    // Testing Library 14: render passou a ser assíncrono.
    const { getByText } = await render(<Text>Hello</Text>);
    getByText('Hello');
  });
});
