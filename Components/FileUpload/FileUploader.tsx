import React from 'react';
import FileProto from './others/file';

import './FileUploader.css';
import DragDropArea from './DragDropArea/DragDropArea';
import IconFolder from './others/IconFolder';

interface iComponentProps {
    maxFileSize?: number | null | undefined;
}

interface iComponentState {
    files: FileProto[],
}

class FileUploader extends React.Component<iComponentProps, iComponentState> {
    private fileControl: HTMLInputElement | null | undefined;

    constructor(props: any) {
        super(props);
        this.state = {
            files: [],
        }
        this.onChangeFile = this.onChangeFile.bind(this);
        this.getFileNameforRender = this.getFileNameforRender.bind(this);
        this.onFileLoadEnd = this.onFileLoadEnd.bind(this);
        this.onDragDropFileChosen = this.onDragDropFileChosen.bind(this);
    }

    getFileNameforRender = () => {
        if (this.state) {
            if (this.state.files) {
                if (this.state.files.length > 0) {
                    if (this.state.files?.length === 1)
                        return this.state.files[0].fileName;
                    else
                        return this.state.files.length + ' files chosen';
                }
            }
        }
        return '';
    }

    onFileLoadEnd(file: any) {
        const fileBinary = file.target.result;

        if (fileBinary === "") {
            //Show Error
            return false;
        }

        if (this.props.maxFileSize) {
            if (fileBinary.length > (this.props.maxFileSize * 1024)) {
                //Show Error
                return false;
            }
        }

        this.setState({
            files: [...this.state.files, new FileProto(file.target.fileName, fileBinary)]
        });

        return true;
    }

    onFileButtonClick = () => {
        this.fileControl?.click();
    }

    onChangeFile() {
        try {
            if (!this.fileControl?.files) {
                return false;
            }
            if (this.fileControl?.files.length < 1) {
                return false;
            }

            this.setState({ files: [] });

            for (let i = 0; i < this.fileControl?.files.length; i++) {
                const reader = new FileReader();
                Object.defineProperty(reader, 'fileName', { value: this.fileControl?.files[i].name })
                reader.onloadend = this.onFileLoadEnd.bind(this);
                reader.readAsDataURL(this.fileControl?.files[i]);
            }
        } catch (ex) {
            return false;
        }
    }

    onDragDropFileChosen(files: FileList) {
        for (let i = 0; i < files.length; i++) {
            this.setState({
                files: [...this.state.files, new FileProto(files[i].name, [])]
            });
        }
    }

    render() {
        return (<div className="md-file-control">
            <div className="md-file-picker-control-area">
                <div className="md-file-picker-control-container">
                    <input className="md-file-name-text md-place-holder-text" placeholder="Choose your file"
                        value={this.getFileNameforRender()} readOnly />
                    <button className="md-file-chose-button md-button" onClick={() => this.onFileButtonClick()}>
                        <IconFolder/>
                    </button>
                    <input ref={(ref) => this.fileControl = ref} type="file" accept='*.*' multiple style={{ display: 'none' }}
                        onChange={() => this.onChangeFile()} />
                </div>
            </div>
            <div className="md-file-preview-area">
                <div className="md-file-preview-container">
                    <div className="md-file-preview-control">
                        <DragDropArea onFilesChosen={this.onDragDropFileChosen}></DragDropArea>
                    </div>
                </div>
                <div className="md-reset-button-container">
                    <button className="md-reset-button md-button"></button>
                    <p className="md-file-size-caption">{}</p>
                    <p className="md-file-size-value"></p>
                </div>
            </div>
        </div>);
    }
}

export default FileUploader;
