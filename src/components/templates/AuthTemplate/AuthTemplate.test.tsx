import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import TestAppWrapper from '@/tests/TestAppWrapper';

import AuthTemplate from './AuthTemplate';

const TITLE = 'Selamat datang kembali!';
const SUBTITLE = 'SARA siap membantumu menyelesaikan hal-hal penting hari ini.';

describe('AuthTemplate', () => {
  it('renders the brand wordmark, title and subtitle', () => {
    render(
      <AuthTemplate subtitle={SUBTITLE} title={TITLE}>
        <Text>Form</Text>
      </AuthTemplate>,
      { wrapper: TestAppWrapper },
    );

    expect(screen.getByText('SARA.')).toBeTruthy();
    expect(screen.getByText(TITLE)).toBeTruthy();
    expect(screen.getByText(SUBTITLE)).toBeTruthy();
  });

  it('renders its children and footer', () => {
    render(
      <AuthTemplate
        footer={<Text>Footer</Text>}
        subtitle={SUBTITLE}
        title={TITLE}
      >
        <Text>Form content</Text>
      </AuthTemplate>,
      { wrapper: TestAppWrapper },
    );

    expect(screen.getByText('Form content')).toBeTruthy();
    expect(screen.getByText('Footer')).toBeTruthy();
  });

  it('renders no footer when none is given', () => {
    render(
      <AuthTemplate subtitle={SUBTITLE} title={TITLE}>
        <Text>Form content</Text>
      </AuthTemplate>,
      { wrapper: TestAppWrapper },
    );

    expect(screen.queryByText('Footer')).toBeNull();
  });
});
