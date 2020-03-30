/**
 * @name react 表情包 制作器
 * @author jinke.li
 */
import React, {PureComponent, Fragment} from "react";
import Container from "./components/Container";
import cls from "classnames";
import {
  Button,
  Divider,
  Col,
  Row,
  Form,
  Input,
  Checkbox,
  Modal,
  message,
  Select,
  Slider,
  Tooltip,
  Radio
} from "antd";
import {SketchPicker} from "react-color";
import Draggable from "react-draggable";
import domToImage from "dom-to-image";
import {hot} from "react-hot-loader";
import {
  prefix,
  fontFamily,
  defaultFontText,
  defaultFontColor,
  imageProcess,
  defaultFontSize,
  defaultFontSizeName,
  fontSize as FONT_SIZE,
  maxFileSize as IMG_MAX_SIZE,
  previewContentStyle,
  range,
  textRange,
  whellScaleRange,
  textWhellScaleRange,
  defaultScale,
  defaultRotate,
  defaultQuality,
  defaultFontName,
  logo,
  zoom
} from "./config";

import {isImage} from "./utils";
import {
  name as APPNAME,
  version as APPVERSION,
  repository
} from "../package.json";

const {FormItem} = Form;
const {Option} = Select;
const {TextArea} = Input;
const RadioGroup = Radio.Group;

class ReactMemeGenerator extends PureComponent {
  state = {
    cameraVisible: false,
    displayColorPicker: false,
    fontColor: defaultFontColor,
    fontSize: defaultFontSize,
    fontSizeName: defaultFontSizeName,
    text: defaultFontText,
    name: defaultFontName,
    font: fontFamily[0].value,
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
    zoom: zoom
  };
  activeDragAreaClass = "drag-active";

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    defaultFont: fontFamily[0].value,
    defaultImageProcess: imageProcess[0].value,
    defaultText: defaultFontText,
    defaultFontSize,
    defaultFontSizeName,
    drag: true,
    paste: true
  };
  imageWidthChange = e => {
    this.setState({width: e.target.value});
  };
  imageHeightChange = e => {
    this.setState({height: e.target.value});
  };

  drawMeme = () => {
    const {width, height, loadingImgReady, isCompress} = this.state;
    if (!loadingImgReady) return message.error("Bild Hochladen");

    this.setState({drawLoading: true});

    var imageArea = document.querySelector(".preview-content");
    imageArea.classList.toggle('zoom');
    const options = {
      width,
      height,
    }
    if (isCompress) {
      options.quality = defaultQuality
    }
    domToImage
      .toPng(imageArea, options)
      .then(dataUrl => {
        this.setState({drawLoading: false});
        Modal.confirm({
          title: "Erfolgreich generiert",
          content: <img src={dataUrl} style={{maxWidth: "100%"}}/>,
          onOk: () => {
            message.success("Erfolgreich!");
            const filename = Date.now() + '_sp-statement'
            const ext = isCompress ? 'jpeg' : 'png'
            var link = document.createElement("a");
            link.download = `${filename}.${ext}`;
            link.href = dataUrl;
            var imageArea = document.querySelector(".preview-content");
            imageArea.classList.toggle('zoom');
            link.click();
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
  closeImageWhellTip = () => {
    setImmediate(() => {
      this.setState({imageWhellTipVisible: false});
    });
  };
  resizeImageScale = () => {
    const {scale} = this.state;
    if (scale != defaultScale) {
      this.setState({scale: defaultScale});
    }
  };
  resetImageRotate = () => {
    const {rotate} = this.state;
    if (rotate != defaultRotate) {
      this.setState({scale: defaultRotate});
    }
  };

  bindTextWheel = e => {
    e.stopPropagation();
    const y = e.deltaY ? e.deltaY : e.wheelDeltaY;
    const [min, max] = textWhellScaleRange;
    this.setState(({fontSize}) => {
      let _fontSize = fontSize;
      if (y > 0) {
        _fontSize -= textRange;
        _fontSize = Math.max(min, _fontSize);
        return {
          fontSize: _fontSize
        };
      } else {
        _fontSize += textRange;
        _fontSize = Math.min(max, _fontSize);
        return {
          fontSize: _fontSize
        };
      }
    });
    return false;
  };

  bindImageMouseWheel = e => {
    const y = e.deltaY ? e.deltaY : e.wheelDeltaY;
    const [min, max] = whellScaleRange;
    this.setState(({scale}) => {
      let _scale = scale;
      if (y > 0) {
        _scale -= range;
        _scale = Math.max(min, _scale);
        return {
          scale: _scale,
          imageWhellTipVisible: true
        };
      } else {
        _scale += range;
        _scale = Math.min(max, _scale);
        return {
          scale: _scale,
          imageWhellTipVisible: true
        };
      }
    });
    return false;
  };
  fontSizeChange = value => {
    this.setState({fontSize: value});
  };
  onSelectFile = () => {
    this.file.click();
  };
  imageChange = () => {
    const files = Array.from(this.file.files);
    this.renderImage(files[0]);
  };
  renderImage = file => {
    if (file && Object.is(typeof file, "object")) {
      let {type, name, size} = file;
      if (!isImage(type)) {
        return message.error("Ungültiges Bildformat");
      }
      this.setState({loading: true});
      const url = window.URL.createObjectURL(file);
      this.setState({
        currentImg: {
          src: url,
          size: `${~~(size / 1024)}KB`,
          type
        },
        scale: defaultScale,
        loading: false,
        loadingImgReady: true
      });
    }
  };
  stopAll = target => {
    target.stopPropagation();
    target.preventDefault();
  };
  bindDragListener = (dragArea, dragAreaClass = true) => {
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
        const files = e.dataTransfer.files;
        this.renderImage(Array.from(files)[0]);
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
  onNameChange = e => {
    this.setState({name: e.target.value});
  };
  fontFamilyChange = value => {
    this.setState({font: value});
  };
  stopDragText = (e, {x, y}) => {
    this.setState({
      textDragX: x,
      textDragY: y
    });
  };
  stopDragImage = (e, {x, y}) => {
    this.setState({
      imageDragX: x,
      imageDragY: y
    });
  };
  rotateImage = value => {
    this.setState({rotate: value});
  };
  toggleRotateStatus = e => {
    this.setState({
      isRotateText: e.target.checked
    });
  };
  pasteHandler = e => {
    const {items, types} = e.clipboardData;
    if (!items) return;

    const item = items[0];
    const {kind, type} = item;
    if (kind.toLocaleLowerCase() != "file") {
      return message.error("Falscher Dateityp!");
    }
    const file = item.getAsFile();
    this.renderImage(file);
  };
  bindPasteListener = area => {
    area.addEventListener("paste", this.pasteHandler);
  };
  unBindPasteListener = area => {
    area.removeEventListener("paste", this.pasteHandler);
  };
  howToUse = () => {
    Modal.info({
      title: "Anleitung",
      content: (
        <ul>
          <li>Bild einfügen und platzieren</li>
          <li>Mit Zoom können sie den ausschnitt verändern</li>
          <li>Jede Textzeile kann einzeln plaziert werden</li>
        </ul>
      )
    });
  };
  turnImage = value => {
    this.setState(({isRotateX}) => ({
      [isRotateX ? "rotateX" : "rotateY"]: value
    }));
  };
  turnRotateChange = e => {
    this.setState({isRotateX: e.target.value, rotateX: 0, rotateY: 0});
  };
  onCompress = (e) => {
    this.setState({isCompress: e.target.checked})
  }
  compressChange = (value) => {
    this.setState({quality: value})
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 14}
    };
    const buttonItemLayout = {
      wrapperCol: {span: 14, offset: 4}
    };

    const {
      cameraVisible,
      cameraUrl,
      fontColor,
      fontSize,
      fontSizeName,
      font,
      text,
      name,
      displayColorPicker,
      loading,
      loadingImgReady,
      currentImg,
      dragAreaClass,
      textDragX,
      textDragY,
      imageDragX,
      imageDragY,
      isRotateText,
      rotate,
      scale,
      imageWhellTipVisible,
      memeModalVisible,
      drawLoading,
      rotateX,
      rotateY,
      width,
      height,
      isCompress
    } = this.state;

    const _scale = scale.toFixed(2);

    const {
      defaultFont,
      defaultFontSize,
      defaultFontSizeName,
      defaultImageProcess,
      defaultText
    } = this.props;

    const labelSpan = 4;
    const valueSpan = 19;
    const offsetSpan = 1;

    const operationRow = ({icon = "edit", label, component}) => (
      <Row className={`${prefix}-item`}>
        <Col span={labelSpan} className={`${prefix}-item-label`}>
          <Button type="dashed" icon={icon}>
            {label}
          </Button>
        </Col>
        <Col
          span={valueSpan}
          offset={offsetSpan}
          className={`${prefix}-item-input`}
        >
          {component}
        </Col>
      </Row>
    );

    const imageTransFormConfig = {
      transform: `rotate(${rotate}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${_scale})`
    };

    const previewImageEvents = loadingImgReady
      ? {
        onWheel: this.bindImageMouseWheel,
        onMouseLeave: this.closeImageWhellTip
      }
      : {};

    const previewImageSize = {
      width: `${width}px`,
      height: `${height}px`
    }

    return (
      <Container className={prefix}>
        <section
          className={`${prefix}-main`}
          ref={previewArea => (this.previewArea = previewArea)}
        >

          <Row type="flex" align="middle" className="preview-container"
               style={{alignItems: 'center'}}>
            <Col>
              <Tooltip
                placement="top"
                title={[
                  <span className="tip-text" key="tip-text">
                    Skalieren: {_scale}
                  </span>,
                  <Button
                    key="resize-btn"
                    className={`${prefix}-resize-btn`}
                    size="small"
                    onClick={this.resizeImageScale}
                  >
                    Wiederherstellen
                  </Button>
                ]}
                visible={imageWhellTipVisible}
              >
                <div
                  ref={node => (this.previewContent = node)}
                  className={cls("preview-content zoom", {
                    [this.activeDragAreaClass]: dragAreaClass
                  })}
                  {...previewImageEvents}
                  style={
                    isRotateText
                      ? {...imageTransFormConfig, ...previewImageSize}
                      : previewImageSize
                  }
                >
                  {loadingImgReady ? (
                    <Draggable
                      onStop={this.stopDragImage}
                      defaultPosition={{x: 0, y: 0}}
                    >
                      <div>
                        <img
                          className="preview-image"
                          ref={node => (this.previewImage = node)}
                          src={currentImg.src}
                          style={loadingImgReady ? imageTransFormConfig : {}}
                        />
                      </div>
                    </Draggable>
                  ) : (
                    undefined
                  )}

                  <Draggable defaultPosition={{x: 40, y: 100}}>
                      <pre
                        className={`${prefix}-text`}
                        style={{
                          color: fontColor,
                          fontSize,
                          fontFamily: font
                        }}
                      >
                        {text}
                      </pre>
                  </Draggable>

                  <Draggable defaultPosition={{x: 236, y: 906}}>
                      <pre
                        className={`${prefix}-name`}
                        style={{
                          color: fontColor,
                          fontSize: fontSizeName,
                          fontFamily: font
                        }}
                      >
                        {name}
                      </pre>
                  </Draggable>


                  <div className="preview-background">
                    <img src={logo}/>
                  </div>
                </div>
              </Tooltip>

              <Row>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={node => (this.file = node)}
                  onChange={this.imageChange}
                />
                <Col span={24}>
                  <Button
                    icon="folder-add"
                    type="dashed"
                    size="large"
                    loading={loading}
                    onClick={this.onSelectFile}
                  >
                    {loading ? "Bild wird geladen" : "Wähle ein Bild"}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row type="flex" className="input-text">
            <Col span={24}>
              {operationRow({
                label: "Text",
                component: [
                  <TextArea
                    rows={8}
                    value={text}
                    placeholder="Bitte geben Sie ihr Statement ein"
                    onChange={this.onTextChange}
                    style={{marginBottom: 10}}
                    key="text-area"
                    className="main-text"
                  />,
                ]
              })}
              {operationRow({
                label: "Name",
                component: [
                  <TextArea
                    autosize={true}
                    value={name}
                    placeholder="Bitte geben Sie ihr Name ein"
                    onChange={this.onNameChange}
                    style={{marginBottom: 10}}
                    key="text-area"
                    className="name-text"
                  />,
                ]
              })}

              {operationRow({
                icon: "file-word",
                label: "Textgrösse",
                component: (
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
                )
              })}

              <Row>
                <Col span={24}>
                  <Button
                    icon="star-o"
                    loading={drawLoading}
                    type="primary"
                    size="large"
                    onClick={this.drawMeme}
                    style={{
                      width: "100%"
                    }}
                  >
                    {drawLoading ? "Bitte kurz warten..." : "Statement generieren"}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </section>

        <Modal
          maskClosable={false}
          visible={memeModalVisible}
          title="Emoticon-Generation"
          okText="Generierung bestätigen"
          cancelText="Passen Sie erneut an"
          onCancel={this.closeMemeModal}
          onOk={this.createMeme}
        >
          <canvas ref={node => (this.memeCanvas = node)}/>
        </Modal>
      </Container>
    );
  }

  componentWillUnmount() {
    const {drag, paste} = this.props;
    paste && this.unBindPasteListener(document.body);
  }

  componentDidMount() {
    const {drag, paste} = this.props;
    drag && this.bindDragListener(this.previewContent);
    paste && this.bindPasteListener(document.body);
  }
}

const _ReactMemeGenerator = Form.create()(ReactMemeGenerator);

export default hot(module)(_ReactMemeGenerator);
