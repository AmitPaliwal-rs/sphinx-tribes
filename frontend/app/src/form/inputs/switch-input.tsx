import React, { useEffect } from 'react';
import styled from 'styled-components';
import { EuiSwitch, EuiText } from '@elastic/eui';
import type { Props } from './propsType';
import { FieldEnv, Note } from './index';
import { wantedCodingTaskSchema } from '../schema';
import { colors } from '../../colors';

export default function SwitchInput({
  label,
  note,
  value,
  name,
  handleChange,
  handleBlur,
  handleFocus,
  readOnly,
  prepend,
  extraHTML
}: Props) {
  useEffect(() => {
    // if value not initiated, default value true
    if (name === 'show' && value === undefined) handleChange(true);

    // if (name === 'github_description') {
    //   wantedCodingTaskSchema.map((val) => {
    //     if (val.name === 'description') {
    //       console.log(val.name, value);
    //       return { ...val, type: value ? 'hide' : 'textarea' };
    //     }
    //   });
    // }
  }, []);

  const color = colors['light'];

  return (
    <>
      <Container color={color}>
        <EuiText className="Label">{label}</EuiText>
        <EuiSwitch
          className="switcher"
          label=""
          checked={value}
          onChange={(e) => {
            handleChange(e.target.checked);
          }}
          onBlur={handleBlur}
          onFocus={handleFocus}
          compressed
          style={{
            border: 'none',
            background: 'inherit'
          }}
        />
      </Container>
      {note && <Note color={color}>*{note}</Note>}
      <ExtraText
        style={{ display: value && extraHTML ? 'block' : 'none' }}
        dangerouslySetInnerHTML={{ __html: extraHTML || '' }}
      />
    </>
  );
}

interface styledProps {
  color?: any;
}

const ExtraText = styled.div<styledProps>`
  color: ${(p) => p?.color && p?.color.grayish.G760};
  padding: 10px 10px 25px 10px;
  max-width: calc(100% - 20px);
  word-break: break-all;
  font-size: 14px;
`;

const Container = styled.div<styledProps>`
  padding: 10px;
  display: flex;
  align-items: center;
  .Label {
    font-family: 'Barlow';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 35px;
    display: flex;
    align-items: center;
    color: #292c33;
    margin-right: 4px;
  }
`;
