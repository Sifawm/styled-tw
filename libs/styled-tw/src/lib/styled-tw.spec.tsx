/* eslint-disable no-constant-binary-expression */
import { render } from '@testing-library/react';
import { create } from './styled-tw';

describe('StyledTw', () => {
  const styled = create();

  it('should accepts single string', () => {
    const Component = styled.div('text-center');

    const { baseElement } = render(<Component />);

    const st = baseElement.children[0].children[0];

    expect(st.className).toBe('text-center');
  });

  it('should accepts undefined', () => {
    const Component = styled.div(undefined);

    const { baseElement } = render(<Component />);

    const st = baseElement.children[0].children[0];

    expect(st.className).toBe('');
  });

  it('should accepts conditional', () => {
    const Component = styled.div(true && 'uppercase');

    const { baseElement } = render(<Component />);

    const st = baseElement.children[0].children[0];

    expect(st.className).toBe('uppercase');
  });

  it('should accepts multiple values', () => {
    const Component = styled.div('text-center', undefined, true && 'uppercase');

    const { baseElement } = render(<Component />);

    const st = baseElement.children[0].children[0];

    expect(st.className).toBe('text-center uppercase');
  });

  it('should accepts children', () => {
    const Component = styled.div('text-center');

    const { baseElement } = render(<Component>Children</Component>);

    const st = baseElement.children[0].children[0];

    expect(st.className).toBe('text-center');
  });

  describe('extends styles', () => {
    const Base = ({ className }: { className?: string | { slot: string } }) => (
      <div
        className={`base-element ${
          typeof className === 'string' ? className : className?.slot
        }`}
      />
    );

    it('should extends styles', () => {
      const Component = styled(Base)(
        'text-center',
        undefined,
        true && 'uppercase'
      );

      const { baseElement } = render(<Component />);

      const st = baseElement.children[0].children[0];

      expect(st.className).toBe('base-element text-center uppercase');
    });

    it('should accepts single object', () => {
      const Component = styled(Base)({ slot: 'text-center' });

      const { baseElement } = render(<Component />);

      const st = baseElement.children[0].children[0];

      expect(st.className).toBe('base-element text-center');
    });

    it('should accepts multiple objects', () => {
      const Component = styled(Base)(
        { slot: 'text-center' },
        { slot: undefined },
        { slot: 'uppercase' }
      );

      const { baseElement } = render(<Component />);

      const st = baseElement.children[0].children[0];

      expect(st.className).toBe('base-element text-center uppercase');
    });
  });

  describe('with Props', () => {
    it('should accepts single string', () => {
      const Component = styled.div((props) => 'opacity-100');

      const { baseElement: baseElementActive } = render(<Component />);

      const stActive = baseElementActive.children[0].children[0];

      expect(stActive.className).toBe('opacity-100');
    });

    it('should accepts undefined', () => {
      const Component = styled.div(() => undefined);

      const { baseElement: baseElementActive } = render(<Component />);

      const stActive = baseElementActive.children[0].children[0];

      expect(stActive.className).toBe('');
    });

    it('should accepts conditional', () => {
      const Component = styled.div<{ $disabled?: boolean }>((props) =>
        props.$disabled ? 'opacity-50' : 'opacity-100'
      );

      const { baseElement: baseElementActive, rerender } = render(
        <Component />
      );

      const stActive = baseElementActive.children[0].children[0];

      expect(stActive.className).toBe('opacity-100');

      rerender(<Component $disabled />);

      expect(stActive.className).toBe('opacity-50');
    });

    it('should accepts multiple values', () => {
      const Component = styled.div<{ $disabled?: boolean }>(
        (props) => (props.$disabled ? 'opacity-50' : 'opacity-100'),
        'text-center',
        'uppercase'
      );

      const { baseElement: baseElementActive, rerender } = render(
        <Component />
      );

      const stActive = baseElementActive.children[0].children[0];

      expect(stActive.className).toBe('opacity-100 text-center uppercase');

      rerender(<Component $disabled />);

      expect(stActive.className).toBe('opacity-50 text-center uppercase');
    });

    it('should accepts children', () => {
      const Component = styled.div<{ $disabled?: boolean }>('text-center');

      const { baseElement } = render(<Component>Children</Component>);

      const st = baseElement.children[0].children[0];

      expect(st.className).toBe('text-center');
    });
  });
});
