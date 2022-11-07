import { EuiText } from '@elastic/eui';
import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../colors';
import BountyDescription from '../../sphinxUI/bounty_description';
import BountyPrice from '../../sphinxUI/bounty_price';
import BountyProfileView from '../../sphinxUI/bounty_profile_view';
import IconButton from '../../sphinxUI/icon_button';
import StartUpModal from './start_up_modal';

const Bounties = (props) => {
  const color = colors['light'];
  const [openStartUpModel, setOpenStartUpModel] = useState<boolean>(false);
  const closeModal = () => setOpenStartUpModel(false);
  const showModal = () => setOpenStartUpModel(true);
  return (
    <>
      {{ ...props.assignee }.owner_alias ? (
        <BountyContainer assignedBackgroundImage={'url("/static/assigned_bounty_bg.svg")'}>
          <div className="BountyDescriptionContainer">
            <BountyDescription
              {...props}
              title={props.title}
              codingLanguage={props.codingLanguage}
            />
          </div>
          <div className="BountyPriceContainer">
            <BountyPrice
              priceMin={props.priceMin}
              priceMax={props.priceMax}
              price={props.price}
              sessionLength={props.sessionLength}
              style={{
                minWidth: '213px',
                maxWidth: '213px',
                borderRight: `1px solid ${color.primaryColor.P200}`
              }}
            />

            <BountyProfileView
              assignee={props.assignee}
              status={'ASSIGNED'}
              statusStyle={{
                width: '55px',
                height: '16px',
                background: color.statusAssigned
              }}
            />
          </div>
        </BountyContainer>
      ) : (
        <BountyContainer>
          <DescriptionPriceContainer unAssignedBackgroundImage='url("/static/unassigned_bounty_bg.svg")'>
            <BountyDescription
              {...props}
              title={props.title}
              codingLanguage={props.codingLanguage}
            />
            <BountyPrice
              priceMin={props.priceMin}
              priceMax={props.priceMax}
              price={props.price}
              sessionLength={props.sessionLength}
              style={{
                borderLeft: `1px solid ${color.grayish.G700}`,
                maxWidth: '245px',
                minWidth: '245px'
              }}
            />
            <UnassignedPersonProfile
              unassigned_border={color.grayish.G300}
              grayish_G200={color.grayish.G200}>
              <div className="UnassignedPersonContainer">
                <img src="/static/unassigned_profile.svg" alt="unassigned_person" height={'100%'} width={'100%'} />
              </div>
              <div className="UnassignedPersonalDetailContainer">
                <EuiText className="ProfileText">Do your skills match?</EuiText>
                <IconButton
                  text={'I can help'}
                  endingIcon={'arrow_forward'}
                  width={166}
                  height={48}
                  style={{ marginTop: 20 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    showModal();
                  }}
                  color="primary"
                  hoverColor={color.button_secondary.hover}
                  activeColor={color.button_secondary.active}
                  shadowColor={color.button_secondary.shadow}
                  iconSize={'16px'}
                  iconStyle={{
                    top: '17px',
                    right: '14px'
                  }}
                  textStyle={{
                    width: '108px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    fontFamily: 'Barlow'
                  }}
                />
              </div>
            </UnassignedPersonProfile>
          </DescriptionPriceContainer>
        </BountyContainer>
      )}
      {openStartUpModel && (
        <StartUpModal closeModal={closeModal} dataObject={'getWork'} buttonColor={'primary'} />
      )}
    </>
  );
};

export default Bounties;

interface containerProps {
  unAssignedBackgroundImage?: string;
  assignedBackgroundImage?: string;
  unassigned_border?: string;
  grayish_G200?: string;
}

const BountyContainer = styled.div<containerProps>`
  display: flex;
  flex-direction: row;
  width: 1100px !important;
  font-family: Barlow;
  height: 160px;
  background: transparent;
  background: ${(p) => (p.assignedBackgroundImage ? p.assignedBackgroundImage : '')};
  background-repeat: no-repeat;
  background-size: cover;
  .BountyDescriptionContainer {
    min-width: 553px;
    max-width: 553px;
  }
  .BountyPriceContainer {
    display: flex;
    flex-direction: row;
    width: 545px;
  }
`;

const DescriptionPriceContainer = styled.div<containerProps>`
  display: flex;
  flex-direction: row;
  width: 758px;
  min-height: 160px !important;
  height: 100%;
  background: ${(p) => (p.unAssignedBackgroundImage ? p.unAssignedBackgroundImage : '')};
  background-repeat: no-repeat;
  background-size: cover;
`;

const UnassignedPersonProfile = styled.div<containerProps>`
  min-width: 336px;
  min-height: 160px;
  border: 1px dashed ${(p) => (p.unassigned_border ? p.unassigned_border : '')};
  border-radius: 10px;
  display: flex;
  padding-top: 32px;
  padding-left: 37px;
  .UnassignedPersonContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    width: 80px;
    border-radius: 50%;
    margin-top: 5px;
  }
  .UnassignedPersonalDetailContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 25px;
    margin-bottom: 2px;
  }
  .ProfileText {
    font-size: 15px;
    font-weight: 500;
    font-family: Barlow;
    color: ${(p) => (p.grayish_G200 ? p.grayish_G200 : '')};
    margin-bottom: -13px;
    line-height: 18px;
    display: flex;
    align-items: center;
  }
`;