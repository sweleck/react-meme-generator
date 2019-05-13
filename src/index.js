/**
 * @name react 表情包 制作器
 * @author jinke.li
 */
import React, { PureComponent, Fragment } from "react";
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
import { SketchPicker } from "react-color";
import Draggable from "react-draggable";
import domToImage from "dom-to-image";
import { hot } from "react-hot-loader";
import {
  prefix,
  fontFamily,
  defaultFontText,
  defaultFontColor,
  imageProcess,
  defaultFontSize,
  fontSize as FONT_SIZE,
  maxFileSize as IMG_MAX_SIZE,
  previewContentStyle,
  range,
  textRange,
  whellScaleRange,
  textWhellScaleRange,
  defaultScale,
  defaultRotate,
  defaultQuality
} from "./config";

import { isImage } from "./utils";
import {
  name as APPNAME,
  version as APPVERSION,
  repository
} from "../package.json";

const { FormItem } = Form;
const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

class ReactMemeGenerator extends PureComponent {
  state = {
    cameraVisible: false,
    displayColorPicker: false,
    fontColor: defaultFontColor,
    fontSize: defaultFontSize,
    text: defaultFontText,
    font: fontFamily[0].value,
    loadingImgReady: false,
    dragAreaClass: false, //拖拽区域active class
    textDragX: 0,
    textDragY: 0,
    imageDragX: 0,
    imageDragY: 0,
    isRotateText: false,
    rotate: defaultRotate,
    scale: defaultScale,
    toggleText: false,
    width: previewContentStyle.width,
    height: previewContentStyle.height,
    drawLoading: false,
    rotateX: 0,
    rotateY: 0,
    isRotateX: false,
    isCompress:false
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
    drag: true,
    paste: true
  };
  imageWidthChange = e => {
    this.setState({ width: e.target.value });
  };
  imageHeightChange = e => {
    this.setState({ height: e.target.value });
  };
  toggleColorPicker = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };
  closeColorPicker = () => {
    this.setState({ displayColorPicker: false });
  };
  colorChange = ({ hex }) => {
    this.setState({ fontColor: hex });
  };
  drawMeme = () => {
    const { width, height, loadingImgReady,isCompress } = this.state;
    if (!loadingImgReady) return message.error("Select an image!");

    this.setState({ drawLoading: true });

    const imageArea = document.querySelector(".preview-content");
    const options = {
      width,
      height,
    }
    if(isCompress){
      options.quality = defaultQuality
    }
    domToImage
      .toPng(imageArea, options)
      .then(dataUrl => {
        this.setState({ drawLoading: false });
        Modal.confirm({
          title: "生成成功",
          content: <img src={dataUrl} style={{ maxWidth: "100%" }} />,
          onOk: () => {
            message.success("下载成功!");
            const filename = Date.now()
            const ext = isCompress ? 'jpeg' : 'png'
            var link = document.createElement("a");
            link.download = `${filename}.${ext}`;
            link.href = dataUrl;
            link.click();
          },
          okText: "立即下载",
          cancelText: "再改一改"
        });
      })
      .catch(err => {
        message.error(err);
        this.setState({ drawLoading: false });
      });
  };
  closeImageWhellTip = () => {
    setImmediate(() => {
      this.setState({ imageWhellTipVisible: false });
    });
  };
  resizeImageScale = () => {
    const { scale } = this.state;
    if (scale != defaultScale) {
      this.setState({ scale: defaultScale });
    }
  };
  resetImageRotate = () => {
    const { rotate } = this.state;
    if (rotate != defaultRotate) {
      this.setState({ scale: defaultRotate });
    }
  };
  //文字鼠标滚轮缩放
  bindTextWheel = e => {
    e.stopPropagation();
    const y = e.deltaY ? e.deltaY : e.wheelDeltaY; //火狐有特殊
    const [min, max] = textWhellScaleRange;
    this.setState(({ fontSize }) => {
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
  //图片鼠标滚轮缩放
  bindImageMouseWheel = e => {
    const y = e.deltaY ? e.deltaY : e.wheelDeltaY; //火狐有特殊
    const [min, max] = whellScaleRange;
    this.setState(({ scale }) => {
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
  openCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true
        })
        .then(stream => {
          const hide = message.loading('盛世美颜即将出现...')
          this.setState(
            {
              cameraVisible: true
            },
            () => {
              setTimeout(()=>{
                try {
                  this.video.srcObject = stream
                  this.video.play();
                } catch (err) {
                  console.log(err);
                  Modal.error({
                    title: "摄像头失败",
                    content: err.message
                  });
                } finally{
                  hide()
                }
              },1000)
              
            }
          );
        })
        .catch(err => {
          console.log(err)
          Modal.error({
            title: "调用摄像头失败",
            content: err.toString()
          });
          this.setState({ cameraVisible: false });
        });
    } else {
      Modal.error({ title: "抱歉,你的电脑暂不支持摄像头!" });
      this.setState({ cameraVisible: false });
    }
    // this.setState({ cameraVisible: true })
  };
  closeCamera = () => {
    this.setState({ cameraVisible: false, cameraUrl:"" });
  };
  fontSizeChange = value => {
    this.setState({ fontSize: value });
  };
  screenShotCamera = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const { width, height } = previewContentStyle;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(this.video, 0, 0, width, height);
    const data = canvas.toDataURL("image/png");
    message.success('截取摄像头画面成功！')
    this.setState({
      currentImg: {
        src: data
      },
      cameraVisible:false,
      scale: defaultScale,
      loading: false,
      loadingImgReady: true
    });
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
      let { type, name, size } = file;
      if (!isImage(type)) {
        return message.error("无效的图片格式");
      }
      this.setState({ loading: true });
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
  //绑定拖拽事件
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
    //进入
    dragArea.addEventListener(
      "dragenter",
      e => {
        this.stopAll(e);
        this.addDragAreaStyle();
      },
      false
    );
    //离开
    dragArea.addEventListener(
      "dragleave",
      e => {
        this.stopAll(e);
        this.removeDragAreaStyle();
      },
      false
    );
    //移动
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
    this.setState({ dragAreaClass: true });
  };
  removeDragAreaStyle = () => {
    this.setState({ dragAreaClass: false });
  };
  onTextChange = e => {
    this.setState({ text: e.target.value });
  };
  fontFamilyChange = value => {
    this.setState({ font: value });
  };
  stopDragText = (e, { x, y }) => {
    this.setState({
      textDragX: x,
      textDragY: y
    });
  };
  stopDragImage = (e, { x, y }) => {
    this.setState({
      imageDragX: x,
      imageDragY: y
    });
  };
  rotateImage = value => {
    this.setState({ rotate: value });
  };
  toggleRotateStatus = e => {
    this.setState({
      isRotateText: e.target.checked
    });
  };
  toggleText = e => {
    this.setState({ toggleText: e.target.checked });
  };
  pasteHandler = e => {
    const { items, types } = e.clipboardData;
    if (!items) return;

    const item = items[0]; //只要一张图片
    const { kind, type } = item; //kind 种类 ,type 类型
    if (kind.toLocaleLowerCase() != "file") {
      return message.error("错误的文件类型!");
    }
    const file = item.getAsFile();
    this.renderImage(file);
  };
  //粘贴图片
  bindPasteListener = area => {
    area.addEventListener("paste", this.pasteHandler);
  };
  unBindPasteListener = area => {
    area.removeEventListener("paste", this.pasteHandler);
  };
  howToUse = () => {
    Modal.info({
      title: "使用说明",
      content: (
        <ul>
          <li>支持图片拖拽和粘贴</li>
          <li>选择图片后可使用鼠标滚轮缩放</li>
          <li>每行文字可单独拖拽</li>
        </ul>
      )
    });
  };
  //翻转图片
  turnImage = value => {
    this.setState(({ isRotateX }) => ({
      [isRotateX ? "rotateX" : "rotateY"]: value
    }));
  };
  turnRotateChange = e => {
    this.setState({ isRotateX: e.target.value,rotateX:0,rotateY:0 });
  };
  onCompress = (e)=>{
    this.setState({isCompress:e.target.checked})
  }
  compressChange = (value)=>{
    this.setState({quality:value})
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    };
    const buttonItemLayout = {
      wrapperCol: { span: 14, offset: 4 }
    };

    const {
      cameraVisible,
      cameraUrl,
      fontColor,
      fontSize,
      font,
      text,
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
      toggleText,
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
      defaultImageProcess,
      defaultText
    } = this.props;

    const labelSpan = 4;
    const valueSpan = 19;
    const offsetSpan = 1;

    const operationRow = ({ icon = "edit", label, component }) => (
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
      width:`${width}px`,
      height:`${height}px`
    }

    return (
      <Container className={prefix}>
        <Divider>
          <h2 className="title">
            <a href={repository.url}>{APPNAME}</a>
          </h2>
        </Divider>
        <section
          className={`${prefix}-main`}
          ref={previewArea => (this.previewArea = previewArea)}
        >
          <Row>
            <Col span="8">
              <Tooltip
                placement="top"
                title={[
                  <span className="tip-text" key="tip-text">
                    缩放比例: {_scale}
                  </span>,
                  <Button
                    key="resize-btn"
                    className={`${prefix}-resize-btn`}
                    size="small"
                    onClick={this.resizeImageScale}
                  >
                    还原
                  </Button>
                ]}
                visible={imageWhellTipVisible}
              >
                <div
                  ref={node => (this.previewContent = node)}
                  className={cls("preview-content", {
                    [this.activeDragAreaClass]: dragAreaClass
                  })}
                  {...previewImageEvents}
                  style={
                    isRotateText
                      ? { ...imageTransFormConfig, ...previewImageSize }
                      : previewImageSize
                  }
                >
                  {loadingImgReady ? (
                    <Draggable
                      onStop={this.stopDragImage}
                      defaultPosition={{ x: 0, y: 0 }}
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

                  {toggleText ? (
                    text.split(/\n/).map((value, i) => {
                      return (
                        <Draggable
                          bounds="parent"
                          onStop={this.stopDragText}
                          key={i}
                          defaultPosition={{ x: 0, y: fontSize * i }}
                        >
                          <div
                            key={i}
                            className={`${prefix}-text`}
                            style={{
                              color: fontColor,
                              fontSize,
                              fontFamily: font
                            }}
                          >
                            {value}
                          </div>
                        </Draggable>
                      );
                    })
                  ) : (
                    <Draggable defaultPosition={{ x: 0, y: 0 }}>
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
                  )}
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
                <Col span={6}>
                  <Button
                    icon="folder-add"
                    type="dashed"
                    size="large"
                    loading={loading}
                    onClick={this.onSelectFile}
                  >
                    {loading ? "Please wait.." : "Select image"}
                  </Button>
                </Col>
                <Col span={6} offset={3}>
                  <Button
                    icon="video-camera"
                    type="dashed"
                    size="large"
                    onClick={this.openCamera}
                  >
                    Camera
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col span="16">
              {operationRow({
                label: "Text",
                component: [
                  <TextArea
                    autosize={true}
                    value={text}
                    placeholder="请输入文字"
                    onChange={this.onTextChange}
                    style={{ marginBottom: 10 }}
                    key="text-area"
                  />,
                  <Checkbox
                    key="check-box"
                    value={toggleText}
                    onChange={this.toggleText}
                  >
                   Independent control of each line of text
                  </Checkbox>
                ]
              })}
              {operationRow({
                icon: "file-ppt",
                label: "Font",
                component: (
                  <Select
                    style={{ width: "100%" }}
                    defaultValue={defaultFont}
                    onChange={this.fontFamilyChange}
                  >
                    {fontFamily.map(({ label, value }, i) => (
                      <Option value={value} key={i}>
                        {label}
                      </Option>
                    ))}
                  </Select>
                )
              })}
              {operationRow({
                icon: "pie-chart",
                label: "Text Color",
                component: (
                  <div>
                    <div
                      className="color-section"
                      onClick={this.toggleColorPicker}
                    >
                      <div
                        className="color"
                        style={{
                          background: fontColor
                        }}
                      />
                    </div>
                    {displayColorPicker ? (
                      <div className="popover">
                        <div
                          className="cover"
                          onClick={this.closeColorPicker}
                        />
                        <SketchPicker
                          color={fontColor}
                          onChange={this.colorChange}
                        />
                      </div>
                    ) : (
                      undefined
                    )}
                  </div>
                )
              })}
              {operationRow({
                icon: "line-chart",
                label: "Image Size",
                component: (
                  <Row>
                    <Col span={11}>
                      <Input
                        placeholder="Width"
                        defaultValue={previewContentStyle.width}
                        addonAfter="px"
                        addonBefore="Width"
                        onChange={this.imageWidthChange}
                      />
                    </Col>
                    <Col span={11} offset={2}>
                      <Input
                        placeholder="Height"
                        defaultValue={previewContentStyle.height}
                        addonAfter="px"
                        addonBefore="Height"
                        onChange={this.imageHeightChange}
                      />
                    </Col>
                  </Row>
                )
              })}
              {operationRow({
                icon: "file-word",
                label: "Font Size",
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
              {operationRow({
                icon: "picture",
                label: "Image Rotation",
                component: (
                  <Slider
                    min={0}
                    max={360}
                    defaultValue={0}
                    tipFormatter={value =>
                      loadingImgReady ? `${value}°` : "Please select an image"
                    }
                    onChange={this.rotateImage}
                    disabled={!loadingImgReady}
                    marks={{
                      0: "0°(no rotation)",
                      90: "90°",
                      180: "180°",
                      360: "360°(no rotation)"
                    }}
                  />
                )
              })}
              {operationRow({
                icon: "share-alt",
                label: "Image Flip",
                component: (
                  <Row>
                    <Col span={15}>
                      <Slider
                        min={0}
                        max={360}
                        step={0.01}
                        defaultValue={0}
                        tipFormatter={value =>
                          loadingImgReady ? `${value}°` : "Please select an image"
                        }
                        onChange={this.turnImage}
                        disabled={!loadingImgReady}
                        marks={{
                          0: "0°(no flip)",
                          90: "90°",
                          180: "180°",
                          360: "360°(no flip)"
                        }}
                      />
                    </Col>
                    <Col span={5} offset={4}>
                      <RadioGroup
                        onChange={this.turnRotateChange}
                        value={this.state.isRotateX}
                      >
                        <Radio value={true}>X-axis flip</Radio>
                        <Radio value={false}>Y-axis flip</Radio>
                      </RadioGroup>
                    </Col>
                  </Row>
                )
              })}
              {operationRow({
                icon: "skin",
                label: "Image Compression",
                component: (
                    <Checkbox onChange={this.onCompress}>Compression</Checkbox>
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
                      width:"100%"
                    }}
                  >
                    {drawLoading ? "Wait a moment..." : "Generating..."}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </section>

        <Modal
          maskClosable={false}
          visible={cameraVisible}
          title="Camera Photo"
          okText="Take a Photo"
          cancelText="Cancel"
          onCancel={this.closeCamera}
          onOk={this.screenShotCamera}
        >
          <video
            style={{
              display:"block",
              margin:"0 auto"
            }}
            ref={video => (this.video = video)}
            src={cameraUrl}
            width={previewContentStyle.width}
            height={previewContentStyle.height}
          />
        </Modal>

        <Modal
          maskClosable={false}
          visible={memeModalVisible}
          title="Generate"
          okText="Confirm"
          cancelText="Cancel"
          onCancel={this.closeMemeModal}
          onOk={this.createMeme}
        >
          <canvas ref={node => (this.memeCanvas = node)} />
        </Modal>
      </Container>
    );
  }
  componentWillUnmount() {
    const { drag, paste } = this.props;
    paste && this.unBindPasteListener(document.body);
    this.video = null;
  }
  componentDidMount() {
    const { drag, paste } = this.props;
    drag && this.bindDragListener(this.previewContent);
    paste && this.bindPasteListener(document.body);
  }
}

const _ReactMemeGenerator = Form.create()(ReactMemeGenerator);

export default hot(module)(_ReactMemeGenerator);
