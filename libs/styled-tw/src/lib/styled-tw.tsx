import React from 'react';

import { cx } from './cx';
import { domElements } from './domElements';

export type ClassName = string | undefined;

export type ClassNameWithProps<Props extends object = any> = (
  props: Props
) => ClassName;

export type ClassNames<P extends object = any> = (
  | ClassName
  | ClassNameWithProps<P>
)[];

export type Slot = { [key: string]: string | undefined };

export type SlotWithProps<Props extends object = any> = (props: Props) => Slot;

export type Slots<P extends object = any> = (Slot | SlotWithProps<P>)[];

export type StyledParams<P extends object = any> = ClassNames<P> | Slots<P>;

export type CleanedClassName = ClassNames[number] | Slots[number];

export type MergeFunction = (classNames: string) => string;

export type ExternalProps<T> = { className?: string } & T;

export type IntrisicElementsMap = {
  [RTag in (typeof domElements)[number]]: <P extends object = any>(
    ...classNames: ClassNames<P>
  ) => React.ForwardRefExoticComponent<
    ExternalProps<P> & React.RefAttributes<unknown>
  >;
};

function mergeSlots(slots: Slot[]) {
  const mergedSlots = slots.reduce((acc, slot) => {
    Object.keys(slot).forEach((key) => {
      if (!slot[key]) {
        return;
      }

      if (key in acc) {
        acc[key].push(slot[key]);
      } else {
        acc[key] = [slot[key]];
      }
    });

    return acc;
  }, {} as { [key: string]: string[] });

  const cleanedSlots: Slots[number] = {};

  Object.keys(mergedSlots).forEach((key) => {
    cleanedSlots[key] = cx(mergedSlots[key]);
  });

  return cleanedSlots;
}

function cleanClassName(
  className: ClassNames,
  propsClassName?: string,
  mergeFunction?: MergeFunction
) {
  const cleaned = cx(className, propsClassName);

  return mergeFunction?.(cleaned) ?? cleaned;
}

const styledFactory = (Element: any) => {
  return <P extends object = any>(...classNames: StyledParams<P>) => {
    const ComponentWithTw = React.forwardRef<unknown, ExternalProps<P>>(
      (props: ExternalProps<P>, ref) => {
        let cleanedClassName: CleanedClassName;

        const internalClassNames = classNames.map((c) => {
          if (typeof c === 'function') {
            return c(props);
          }

          return c;
        });

        if (typeof internalClassNames[0] === 'object') {
          cleanedClassName = mergeSlots(internalClassNames as Slot[]);
        } else {
          cleanedClassName = cleanClassName(
            internalClassNames as ClassName[],
            props.className
          );
        }

        return <Element ref={ref} {...props} className={cleanedClassName} />;
      }
    );

    ComponentWithTw.displayName = `styled-tw-${
      typeof Element === 'function'
        ? Element.displayName ?? Element.name
        : Element
    }`;

    return ComponentWithTw;
  };
};

export function create(
  mergeFunction?: MergeFunction
): IntrisicElementsMap & typeof styledFactory {
  const intrisicElementsMap: IntrisicElementsMap = domElements.reduce(
    (acc, DomElement: string) => ({
      ...acc,
      [DomElement]: styledFactory(DomElement),
    }),
    {} as IntrisicElementsMap
  );

  const styled = Object.assign(styledFactory, intrisicElementsMap);

  return styled;
}
