import { render, screen } from '@testing-library/react-native';

import TestAppWrapper from '@/tests/TestAppWrapper';

import TimelineRow from './TimelineRow';

describe('TimelineRow', () => {
  it('only draws a connector when there is a following row', () => {
    const entry = {
      detail: 'Project notes',
      icon: 'pencil',
      time: '9:45 a.m.',
      title: 'Updated',
    } as const;
    const { rerender } = render(<TimelineRow connectsToNext {...entry} />, {
      wrapper: TestAppWrapper,
    });

    expect(screen.getByTestId('timeline-connector')).toBeOnTheScreen();

    rerender(<TimelineRow {...entry} />);

    expect(screen.queryByTestId('timeline-connector')).not.toBeOnTheScreen();
    expect(screen.getByText('Project notes')).toBeOnTheScreen();
  });
});
