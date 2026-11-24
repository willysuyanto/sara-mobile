import { render, screen } from '@testing-library/react-native';

import TestAppWrapper from '@/tests/TestAppWrapper';

import ActivityCard from './ActivityCard';

describe('ActivityCard', () => {
  it('marks a completed activity as done', () => {
    render(<ActivityCard done time="09.00" title="Review materi APPL" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByText('Selesai')).toBeTruthy();
    expect(screen.getByText('check')).toBeTruthy();
  });

  it('marks a pending activity as scheduled and shows its reminder', () => {
    render(<ActivityCard reminded time="13.00" title="Meeting kelompok" />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByText('Terjadwal')).toBeTruthy();
    expect(screen.getByText('bell')).toBeTruthy();
    expect(screen.queryByText('check')).toBeNull();
  });
});
