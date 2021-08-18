import React, { useRef, useState } from "react";
import { QRCode } from "react-qr-svg";
import styled from "styled-components";
import { getHost } from "../host";
import qrCode from "../utils/invoice-qr-code.svg";
import { EuiCheckableCard, EuiButton, EuiButtonIcon, EuiToolTip } from "@elastic/eui";
import { useObserver } from 'mobx-react-lite'
import { useStores } from '../store'
import {
    EuiModal,
    EuiModalBody,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiOverlayMask,
} from "@elastic/eui";

import { meSchema } from '../form/schema'

import BlogView from "./widgetViews/blogView";
import OfferView from "./widgetViews/offerView";
import TwitterView from "./widgetViews/twitterView";
import SupportMeView from "./widgetViews/supportMeView";
import WantedView from "./widgetViews/wantedView";
import FadeLeft from "../animated/fadeLeft";
import { useEffect } from "react";
import { Button, IconButton } from "../sphinxUI";
import MaterialIcon from "@material/react-material-icon";

const host = getHost();
function makeQR(pubkey: string) {
    return `sphinx.chat://?action=person&host=${host}&pubkey=${pubkey}`;
}

export default function PersonView(props: any) {

    const {
        personId,
        loading,
        goBack
    } = props

    const { main, ui } = useStores()

    const person = (main.people && main.people.length && main.people.find(f => f.id === personId))

    const {
        id,
        img,
        tags,
        description,
        owner_alias,
        unique_name,
        price_to_meet,
        extras
    } = person || {}

    const owner_pubkey = ''

    const [selectedWidget, setSelectedWidget] = useState('');
    const [newSelectedWidget, setNewSelectedWidget] = useState('');
    const [animating, setAnimating] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const qrString = makeQR(owner_pubkey);

    useEffect(() => {
        if (extras && (Object.keys(extras).length > 0)) {
            let name = ''
            // pick the extra with one or more widgets
            Object.keys(extras).forEach(e => {
                if (name) return
                if (extras[e].length > 0) name = e
            })

            setSelectedWidget(name)
            setNewSelectedWidget(name)
        }
    }, [extras])

    function switchWidgets(name) {
        // setting newSelectedWidget will dismount the FadeLeft, 
        // and on dismount, endAnimation runs
        // if (!animating && selectedWidget !== name) {
        setNewSelectedWidget(name)
        setSelectedWidget(name)
        setAnimating(true)
        // }
    }

    function endAnimation() {
        setSelectedWidget(newSelectedWidget)
        setAnimating(false)
    }

    let tagsString = "";
    tags && tags.forEach((t: string, i: number) => {
        if (i !== 0) tagsString += ",";
        tagsString += t;
    });

    function add(e) {
        e.stopPropagation();
    }
    function toggleQR(e) {
        e.stopPropagation();
        setShowQR((current) => !current);
    }

    if (loading) return <div>Loading...</div>

    let widgetSchemas: any = meSchema.find(f => f.name === 'extras')
    if (widgetSchemas && widgetSchemas.extras) {
        widgetSchemas = widgetSchemas && widgetSchemas.extras
    }

    const qrWidth = 209

    let fullSelectedWidget = (extras && selectedWidget) ? extras[selectedWidget] : {}

    // we do this because sometimes the widgets are empty arrays
    let filteredExtras = extras && { ...extras }
    if (filteredExtras) {
        let emptyArrayKeys = ['']

        Object.keys(filteredExtras).forEach(name => {
            const p = extras && extras[name]
            if (Array.isArray(p) && !p.length) {
                emptyArrayKeys.push(name)
            }
            const thisSchema = widgetSchemas && widgetSchemas.find(e => e.name === name)
            if (filteredExtras && thisSchema.single) {
                delete filteredExtras[name]
            }
        })

        emptyArrayKeys.forEach(e => {
            if (filteredExtras && e) delete filteredExtras[e]
        })
    }

    function renderWidgets() {
        if (!selectedWidget || !fullSelectedWidget) {
            return <div style={{ height: 200 }} />
        }

        const widgetSchema: any = widgetSchemas && widgetSchemas.find(f => f.name === selectedWidget) || {}
        const single = widgetSchema.single
        let fields = [...widgetSchema.fields]
        // remove show from display
        fields = fields.filter(f => f.name !== 'show')

        function wrapIt(child) {
            if (single) {
                return null
            }

            return <Panel>
                {(fullSelectedWidget.length > 0) && fullSelectedWidget.map((s, i) => {
                    return <Card key={i} style={{ width: '100%' }}>
                        {React.cloneElement(child, { ...s })}
                    </Card>
                })}
            </Panel>
        }

        switch (widgetSchema.name) {
            case 'twitter':
                return wrapIt(<TwitterView {...fullSelectedWidget} />)
            case 'supportme':
                return wrapIt(<SupportMeView {...fullSelectedWidget} />)
            case 'offer':
                return wrapIt(<OfferView {...fullSelectedWidget} />)
            case 'wanted':
                return wrapIt(<WantedView {...fullSelectedWidget} />)
            case 'blog':
                return wrapIt(<BlogView {...fullSelectedWidget} />)
            default:
                return <></>

        }
    }



    const tabs = {
        about: {
            label: 'About',
            name: 'about',
            action: {
                text: 'Edit Profile',
                icon: 'edit'
            }
        },
        posts: {
            label: 'Posts',
            name: 'posts',
            action: {
                text: 'Create a Post',
                icon: 'add',
                info: "What's on your mind?",
                infoIcon: 'chat_bubble_outline'
            }
        },
        offer: {
            label: 'Offer',
            name: 'offer',
            action: {
                text: 'Sell Something',
                icon: 'local_offer'
            }
        },
        wishlist: {
            label: 'Wishlist',
            name: 'wishlist',
            action: {
                text: 'Add to Wishlist',
                icon: 'star'
            }
        },
    }

    function renderButton() {
        if (!selectedWidget) return <div />

        const { action } = tabs[selectedWidget]
        return <div style={{ padding: 10, margin: '8px 0 5px' }}>
            {action.info &&
                <ActionInfo>
                    <MaterialIcon icon={action.infoIcon} style={{ fontSize: 80 }} />
                    <>{action.info}</>
                </ActionInfo>
            }
            <Button
                text={action.text}
                color='widget'
                leadingIcon={action.icon}
                width='100%'
                height={48}
            />
        </div>
    }

    return (
        <Content>
            <div style={{
                display: 'flex', flexDirection: 'column',
                width: '100%', overflow: 'auto', height: '100%'
            }}>
                <Panel style={{ paddingBottom: 0, paddingTop: 80 }}>
                    <div style={{
                        position: 'absolute',
                        top: 20, left: 0,
                        display: 'flex',
                        justifyContent: 'space-between', width: '100%',
                    }}>
                        <IconButton
                            onClick={goBack}
                            icon='arrow_back'
                        />
                        <IconButton
                            onClick={goBack}
                            icon='logout'
                        />
                    </div>

                    {/* profile photo */}
                    <Head>
                        <Img src={img || '/static/sphinx.png'} />
                        <RowWrap>
                            <Name>{owner_alias}</Name>
                        </RowWrap>

                        <RowWrap style={{ marginBottom: 30, marginTop: 25 }}>
                            <a href={qrString}>
                                <Button
                                    text='Connect'
                                    onClick={add}
                                    color='primary'
                                    height={42}
                                    width={120}
                                />
                            </a>
                            <div style={{ width: 15 }} />
                            <Button
                                text='Support'
                                color='link'
                                height={42}
                                width={120} />
                        </RowWrap>

                        {/* <RowWrap style={{ justifyContent: 'space-around', width: '80%' }}>
                            <Detail><B>300</B> members</Detail>
                            <Detail><B>82</B> Posts</Detail>
                        </RowWrap> */}
                        {/* {extras && extras.twitter &&
                            <RowWrap style={{ alignItems: 'center', margin: 0 }}>
                                <Icon source={'/static/twitter.png'} style={{ width: 14, height: 14, margin: '0 3px 0 0' }} />
                                <div style={{ fontSize: 14, }}>{extras.twitter.handle}</div>
                            </RowWrap>
                        } */}

                    </Head>

                    <Tabs>
                        {tabs && Object.keys(tabs).map((name, i) => {
                            const t = tabs[name]
                            const widgetSchema: any = widgetSchemas && widgetSchemas.find(f => f.name === name) || {}
                            const label = t.label
                            const selected = name === newSelectedWidget

                            return <Tab key={i}
                                selected={selected}
                                onClick={() => {
                                    switchWidgets(name)
                                }}>
                                {label}
                            </Tab>
                        })}

                    </Tabs>

                </Panel>

                <Sleeve>
                    {renderButton()}
                    {renderWidgets()}
                </Sleeve>

                {
                    showQR &&
                    <EuiOverlayMask onClick={() => setShowQR(false)}>
                        <EuiModal onClose={() => setShowQR(false)}
                            initialFocus="[name=popswitch]">
                            <EuiModalHeader>
                                <EuiModalHeaderTitle>{`Add ${owner_alias}`}</EuiModalHeaderTitle>
                            </EuiModalHeader>
                            <EuiModalBody style={{ padding: 0 }}>
                                <QRWrapWrap>
                                    <QRWrap className="qr-wrap float-r">
                                        <QRCode
                                            bgColor={"#FFFFFF"}
                                            fgColor="#000000"
                                            level="Q"
                                            style={{ width: qrWidth }}
                                            value={qrString}
                                        />
                                    </QRWrap>
                                </QRWrapWrap>
                            </EuiModalBody>
                        </EuiModal>
                    </EuiOverlayMask >
                }
            </div>

            {/* <Bottom>
                <a href={qrString}>
                    <EuiButton
                        onClick={add}
                        fill={true}
                        style={{
                            backgroundColor: "#6089ff",
                            borderColor: "#6089ff",
                            fontWeight: 600,
                            fontSize: 12,
                            width: '40%',
                            minWidth: 140,
                            maxWidth: 140,
                            color: '#fff'
                        }}
                        aria-label="join"
                    >
                        JOIN
                    </EuiButton>
                </a>
                <div style={{ width: 20 }} />
                <EuiButton
                    onClick={toggleQR}
                    fill={true}
                    style={{
                        background: "#fff",
                        borderColor: "#5F6368",
                        color: '#5F6368',
                        fontWeight: 600,
                        fontSize: 12,
                        width: '40%',
                        minWidth: 140,
                        maxWidth: 140
                    }}
                    // iconType={qrCode}
                    aria-label="qr-code"
                >
                    QR
                </EuiButton>
            </Bottom> */}
        </Content >

    );
}
interface ContentProps {
    selected: boolean;
}

const Panel = styled.div`
            position:relative;
            background:#ffffff;
            margin-bottom:10px;
            padding:10px;
            box-shadow:0px 0px 3px rgb(0 0 0 / 29%);
            `;
const Content = styled.div`
            display: flex;
            flex-direction:column;

            width:100%;
            height: 100%;
            align-items:center;
            color:#000000;
            background:#f0f1f3;
            `;
const QRWrapWrap = styled.div`
            display: flex;
            justify-content: center;
            `;
const QRWrap = styled.div`
            background: white;
            padding: 5px;
            `;
const Widget = styled.div`

            `;

const ActionInfo = styled.div`
            font-style: normal;
            font-weight: normal;
            font-size: 22px;
            line-height: 26px;
            display: flex;
            align-items: center;
            text-align: center;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color:#B0B7BC;
            margin-bottom:10px;
            `;


/* Placeholder Text */

const Tabs = styled.div`
            display:flex;
            width:100%;
            `;

interface TagProps {
    selected: boolean;
}
const Tab = styled.div<TagProps>`
                display:flex;
                padding:10px;
                margin-right:25px;
                color:${p => p.selected ? '#292C33' : '#8E969C'};
                border-bottom: ${p => p.selected && '4px solid #618AFF'};
                cursor:hover;
                font-weight: 500;
                font-size: 16px;
                line-height: 19px;
                cursor:pointer;
                `;



const Bottom = styled.div`
                height:80px;
                width:100%;
                display:flex;
                justify-content:center;
                align-items:center;
                background: #FFFFFF;
                box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.1);
                `;
const Head = styled.div`
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                width:100%;
                `;

const B = styled.span`
                color:#000;
                font-weight:bold;
                margin-right:5px;
                `;

const Card = styled.div`
                // min-width: 300px;
                // max-width: 700px;
                // padding: 20px;
                // border: 1px solid #ffffff21;
                // background:#ffffff07;
                // border-radius: 5px;
                // overflow:hidden;
                // margin-bottom:20px;
                `;

const SupportMe = styled.div`
                min-width: 300px;
                max-width: 700px;
                padding: 20px;
                border: 1px solid #ffffff21;
                background:#ffffff07;
                border-radius: 5px;
                overflow:hidden;
                margin-bottom:20px;
                `;


const SelectedWidgetWrap = styled.div`
                display:flex;
                width:100%;
                justify-content:space-around;
                flex-wrap:wrap;
                `;
interface WidgetEnvProps {
    selected: boolean;
}
const WidgetEnv = styled.div<WidgetEnvProps>`
                    display:flex;
                    flex-direction:column;
                    align-items:center;
                    justify-content:center;
                    padding:10px;
                    min-width:80px;
                    border-radius:5px;
                    cursor:pointer;
                    background:${p => p.selected && '#ffffff31'};
                    &:hover{
                        background: ${p => !p.selected && '#ffffff21'};
            }
                    `;
const Name = styled.div`
                    font-style: normal;
                    font-weight: 500;
                    font-size: 26px;
                    line-height: 19px;
                    /* or 73% */

                    text-align: center;

                    /* Text 2 */

                    color: #3C3F41;
                    `;

const Detail = styled.div`
                    display:flex;
                    font-family: Roboto;
                    font-style: normal;
                    font-size: 18px;
                    line-height: 18px;
                    /* or 106% */

                    /* Main bottom icons */

                    color: #5F6368;
                    `;

const Sleeve = styled.div`

                    `;

const Description = styled.div`
                    font-family: Roboto;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 13px;
                    line-height: 19px;
                    /* or 146% */


                    /* Secondary Text 4 */

                    color: #8E969C;
                    `;
const Left = styled.div`
                    height: 100%;
                    max-width: 100%;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    `;
const Row = styled.div`
                    display: flex;
                    align-items: center;
                    width:100%;
                    margin: 20px 0;
                    justify-content: space-evenly;
                    `;

const TabRow = styled.div`
                    display: flex;
                    flex-wrap:flex;
                    align-items: center;
                    width:100%;
                    user-select:none;
                    // margin: 10px 0;
                    margin-top:10px;
                    `;
const RowWrap = styled.div`
                    display:flex;
                    justify-content:center;

                    width:100%`;
const Title = styled.h3`
                    margin-right: 12px;
                    font-size: 22px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 100%;
                    min-height: 24px;
                    `;
interface DescriptionProps {
    oneLine: boolean;
}

interface ImageProps {
    readonly src: string;
}
const Img = styled.div<ImageProps>`
                        background-image: url("${(p) => p.src}");
                        background-position: center;
                        background-size: cover;
                        margin-bottom:20px;
                        width:150px;
                        height:150px;
                        border-radius: 50%;
                        position: relative;
                        `;
const Tokens = styled.div`
                        display: flex;
                        align-items: center;
                        `;
const TagsWrap = styled.div`
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                        margin-top: 10px;
                        `;
const Tag = styled.h5`
                        margin-right: 10px;
                        `;
const Intro = styled.div`
                        font-size: 14px;
                        margin: 10px;
                        `;
interface IconProps {
    source: string;
}

const Icon = styled.div<IconProps>`
                            background-image: ${p => `url(${p.source})`};
                            width:150px;
                            height:150px;
                            margin-top:10px;
                            background-position: center; /* Center the image */
                            background-repeat: no-repeat; /* Do not repeat the image */
                            background-size: contain; /* Resize the background image to cover the entire container */
                            border-radius:5px;
                            overflow:hidden;
                            `;