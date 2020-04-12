import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MediaEmbedStyleEditing from './mediaembedstyle/mediaembedstyleediting';
import MediaEmbedStyleUi from './mediaembedstyle/mediaembedstyleui';
import './theme/mediaembed.css';

export default class MediaEmbedStyle extends Plugin {
	static get requires() {
		return [ MediaEmbedStyleEditing, MediaEmbedStyleUi ];
	}

	static get pluginName() {
		return 'MediaEmbedStyle';
	}
}
