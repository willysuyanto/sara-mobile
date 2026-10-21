import type { FC } from 'react';
import type { TextProps } from 'react-native';

import { createElement } from 'react';
import { Text } from 'react-native';

type MockIconProps = {
  readonly color?: string;
  readonly name: string;
  readonly size?: number;
} & TextProps;

const mockIcon: FC<MockIconProps> = ({ color, name, size, style, ...props }) =>
  createElement(
    Text,
    { ...props, style: [{ color, fontSize: size }, style] },
    name,
  );

const mockCreateIconSet = () => mockIcon;

jest.mock('@react-native-vector-icons/common', () => ({
  createIconSet: mockCreateIconSet,
}));
