import { fireEvent, render, screen } from '@testing-library/react-native';

import TestAppWrapper from '@/tests/TestAppWrapper';

import PlannerScreen from './PlannerScreen';

describe('Planner screen', () => {
  it('lets users write a plan, choose an example, and edit the example', () => {
    render(<PlannerScreen />, { wrapper: TestAppWrapper });

    const composer = screen.getByLabelText('Apa yang ingin kamu atur?');
    fireEvent.changeText(composer, 'Belajar besok\nBaca catatan');
    expect(composer).toHaveDisplayValue('Belajar besok\nBaca catatan');

    const example = 'Review materi APPL besok jam 9 pagi';
    fireEvent.press(screen.getByRole('button', { name: example }));
    expect(composer).toHaveDisplayValue(example);

    fireEvent.changeText(composer, 'Review materi APPL besok jam 10 pagi');
    expect(composer).toHaveDisplayValue('Review materi APPL besok jam 10 pagi');
  });

  it('marks review and manual entry as unavailable', () => {
    render(<PlannerScreen />, { wrapper: TestAppWrapper });

    expect(
      screen.getByRole('button', { name: 'Tinjau interpretasi' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Gunakan Input Manual' }),
    ).toBeDisabled();
  });
});
