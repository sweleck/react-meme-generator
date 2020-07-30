/**
 * @name react 表情包 制作器
 * @author jinke.li
 */
import React, {PureComponent} from "react";
import Container from "./components/Container";
import {
  Button,
  Row,
  Form,
  Input,
  Modal,
  message,
  Slider,
} from "antd";
import Draggable from "react-draggable";
import domToImage from "dom-to-image";
import {hot} from "react-hot-loader";
import {readRemoteFile} from 'react-papaparse';
import {
  prefix,
  defaultFontText,
  defaultFontColor,
  imageProcess,
  defaultFontSize,
  defaultFontSizeName,
  fontSize as FONT_SIZE,
  previewContentStyle,
  defaultScale,
  defaultRotate,
  defaultQuality,
  logo,
  data,
  headerText
} from "./config";

const {TextArea} = Input;

class ReactMemeGenerator extends PureComponent {
  state = {
    cameraVisible: false,
    displayColorPicker: false,
    fontColor: defaultFontColor,
    fontSize: defaultFontSize,
    fontSizeName: defaultFontSizeName,
    text: defaultFontText,
    loadingImgReady: false,
    dragAreaClass: false,
    textDragX: 0,
    textDragY: 0,
    imageDragX: 0,
    imageDragY: 0,
    isRotateText: false,
    rotate: defaultRotate,
    scale: defaultScale,
    width: previewContentStyle.width,
    height: previewContentStyle.height,
    drawLoading: false,
    rotateX: 0,
    rotateY: 0,
    isRotateX: false,
    isCompress: false,
    logo: logo,
    data: data,
    loading: true,
    error: false,
    user: ['', '', '', ''],
    headerText: headerText
  };
  activeDragAreaClass = "drag-active";

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    defaultImageProcess: imageProcess[0].value,
    defaultText: defaultFontText,
    defaultFontSize,
    defaultFontSizeName,
    drag: true,
    paste: true
  };

  drawMeme = () => {
    const {width, height, isCompress} = this.state;
    this.setState({drawLoading: true});

    let imageArea = document.querySelector(".preview-content");
    imageArea.classList.toggle('zoom');

    const options = {
      width,
      height,
    };

    if (isCompress) {
      options.quality = defaultQuality
    }

    setTimeout(() => {
      console.log('Hello, World!')
    }, 50);

    let imageArea2 = document.querySelector(".preview-content");

    console.log(options);
    console.log(imageArea2);

    domToImage
      .toPng(imageArea2)
      .then(dataUrl => {
        this.setState({drawLoading: false});
        Modal.confirm({
          title: "Erfolgreich generiert",
          content: <img src={dataUrl} style={{maxWidth: "100%"}}/>,
          onOk: () => {
            message.success("Erfolgreich!");
            const filename = Date.now() + '_sp-statement';
            const ext = isCompress ? 'jpeg' : 'png';
            let link = document.createElement("a");
            link.download = `${filename}.${ext}`;
            link.href = dataUrl;
            let imageArea = document.querySelector(".preview-content");
            imageArea.classList.toggle('zoom');
            link.click();
          },
          onCancel: () => {
            imageArea.classList.toggle('zoom');
          },
          okText: "Herunterladen",
          cancelText: "Ändern"
        });
      })
      .catch(err => {
        message.error(err);
        this.setState({drawLoading: false});
      });
  };

  fontSizeChange = value => {
    this.setState({fontSize: value});
  };

  stopAll = target => {
    target.stopPropagation();
    target.preventDefault();
  };
  bindDragListener = (dragArea = true) => {
    document.addEventListener(
      "dragenter",
      e => {
        this.addDragAreaStyle();
      },
      false
    );
    document.addEventListener(
      "dragleave",
      e => {
        this.removeDragAreaStyle();
      },
      false
    );
    dragArea.addEventListener(
      "dragenter",
      e => {
        this.stopAll(e);
        this.addDragAreaStyle();
      },
      false
    );
    dragArea.addEventListener(
      "dragleave",
      e => {
        this.stopAll(e);
        this.removeDragAreaStyle();
      },
      false
    );
    dragArea.addEventListener(
      "dragover",
      e => {
        this.stopAll(e);
        this.addDragAreaStyle();
      },
      false
    );
    dragArea.addEventListener(
      "drop",
      e => {
        this.stopAll(e);
        this.removeDragAreaStyle();
      },
      false
    );
  };
  addDragAreaStyle = () => {
    this.setState({dragAreaClass: true});
  };
  removeDragAreaStyle = () => {
    this.setState({dragAreaClass: false});
  };
  onTextChange = e => {
    this.setState({text: e.target.value});
  };
  stopDragText = (e, {x, y}) => {
    this.setState({
      textDragX: x,
      textDragY: y
    });
  };

  getCSVData = () => {
    let queryString = window.location.search;
    queryString = queryString.replace('/', '');
    queryString = queryString.replace('?', '');

    const parsedQuery = queryString;
    readRemoteFile(data, {
      complete: (results) => {

        let user = results.data.find(function (element) {
          return element[0] === parsedQuery;
        });

        if (!user) {
          this.setState({
            loading: false,
            error: true
          });
        } else {
          this.setState({
            loading: false,
            user: user
          });
        }
      }
    })
  };

  render() {
    const {
      fontColor,
      fontSize,
      text,
      drawLoading,
      width,
      height
    } = this.state;

    if (this.state.loading === true) {
      this.getCSVData();
      return null;
    }

    if (this.state.error === true) {
      return (
        <Container className={prefix}>
          <div className="errorWrapper">
            <div className="error">
              {"Kandidat*in nicht gefunden"}
            </div>
          </div>
        </Container>
      );
    }

    const {
      defaultFontSize
    } = this.props;

    const previewImageSize = {
      width: `${width}px`,
      height: `${height}px`
    };

    return (
      <Container className={prefix}>
        <section
          className={`${prefix}-main`}
          ref={previewArea => (this.previewArea = previewArea)}
        >

          <Row type="flex" align="middle" className="preview-container"
               style={{alignItems: 'center'}}>
            <div className="preview-inner-container">
              <div
                ref={node => (this.previewContent = node)}
                className={"preview-content zoom"}
                style={previewImageSize}
              >

                <Draggable defaultPosition={{x: 46, y: 492}}>
                  <div
                    className={`${prefix}-text`}
                    style={{
                      color: fontColor,
                      fontSize,
                    }}
                  >
                    <div className="text">
                      <span>{text}</span>
                    </div>
                  </div>
                </Draggable>


                <div className="preview-background">
                  <div className="headerText">
                    {headerText}
                  </div>
                  <img
                    className="portrait"
                    src={"/src/data/" + this.state.user[4]}
                  />
                  <img
                    className="logo"
                    src={logo}
                  />
                  <div className="nameWrapper">
                    <div
                      className={`${prefix}-name`}
                    >
                      {this.state.user[1]}
                    </div>
                    <div
                      className={`${prefix}-name`}
                    >
                      {this.state.user[2]}
                    </div>
                  </div>
                  <div className="constituency">
                    {this.state.user[3]}
                  </div>
                </div>
              </div>
            </div>
          </Row>

          <div className="input-text">
            <TextArea
              rows={6}
              value={text}
              placeholder="Bitte geben Sie ihr Testimonial ein"
              onChange={this.onTextChange}
              style={{marginBottom: 10}}
              key="text-area"
              className="main-text"
            />

            <Slider
              min={FONT_SIZE[0]}
              max={FONT_SIZE[FONT_SIZE.length - 1]}
              value={fontSize}
              defaultValue={defaultFontSize}
              tipFormatter={value => `${value}px`}
              onChange={this.fontSizeChange}
              marks={{
                [FONT_SIZE[0]]: `${FONT_SIZE[0]}px`,
                [FONT_SIZE[FONT_SIZE.length - 1]]: `${[
                  FONT_SIZE[FONT_SIZE.length - 1]
                ]}px`
              }}
            />

            <Button
              loading={drawLoading}
              type="primary"
              size="large"
              onClick={this.drawMeme}
              style={{
                width: "100%"
              }}
            >
              {drawLoading ? "Bitte kurz warten..." : "Testimonial generieren"}
            </Button>
          </div>

        </section>
      </Container>
    );
  }
}

const _ReactMemeGenerator = Form.create()(ReactMemeGenerator);

export default hot(module)(_ReactMemeGenerator);
