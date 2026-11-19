import * as React from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import './Accordion.css';
import { Icon } from '../Icon/Icon';

/**
 * @spec northgate/accordion r1
 * A stack of headings that each show or hide their content. Use it for content people read one part at a time (questions and answers, settings groups), not for steps in order.
 */
export interface AccordionItemData {
  /** Unique within the accordion. */
  value: string;
  /** The heading, one line. */
  title: string;
  /** The content that is shown or hidden. */
  content: React.ReactNode;
  /** Makes this item inert. */
  disabled?: boolean;
}

interface AccordionBase extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'dir'> {
  /** The items, in order. */
  items: AccordionItemData[];
  /** Level of the heading elements (h2 to h6) so the page outline stays right. Defaults to 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}
export interface AccordionSingleProps extends AccordionBase {
  /** One item open at a time (default) or several. */
  type?: 'single';
  /** Open item when uncontrolled. */
  defaultValue?: string;
  /** Open item when controlled; an empty string closes all. */
  value?: string;
  onValueChange?: (value: string) => void;
  /** Lets the open item be closed again. On by default. */
  collapsible?: boolean;
}
export interface AccordionMultipleProps extends AccordionBase {
  type: 'multiple';
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
}
export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(function Accordion(props, ref) {
  const { items, headingLevel = 3, className, ...rest } = props;
  const Heading = `h${headingLevel}` as 'h3';
  const cls = className ? `ds-accordion ${className}` : 'ds-accordion';
  const content = items.map((item) => (
    <RadixAccordion.Item key={item.value} value={item.value} disabled={item.disabled} className="ds-accordion__item">
      <Heading className="ds-accordion__heading">
        <RadixAccordion.Trigger className="ds-accordion__trigger">
          <span className="ds-accordion__title">{item.title}</span>
          <Icon name="chevron-down" size={16} className="ds-accordion__chevron" />
        </RadixAccordion.Trigger>
      </Heading>
      <RadixAccordion.Content className="ds-accordion__body">{item.content}</RadixAccordion.Content>
    </RadixAccordion.Item>
  ));
  if (props.type === 'multiple') {
    const { type: _t, items: _i, headingLevel: _h, className: _c, ...r } = props;
    void _t; void _i; void _h; void _c;
    return <RadixAccordion.Root ref={ref} type="multiple" className={cls} {...(r as object)}>{content}</RadixAccordion.Root>;
  }
  const { type: _t, items: _i, headingLevel: _h, className: _c, collapsible = true, ...r } = rest as AccordionSingleProps;
  void _t; void _i; void _h; void _c;
  return <RadixAccordion.Root ref={ref} type="single" collapsible={collapsible} className={cls} {...(r as object)}>{content}</RadixAccordion.Root>;
});
