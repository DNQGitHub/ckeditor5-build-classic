import Command from '@ckeditor/ckeditor5-core/src/command';
import { isMediaEmbed } from '../utils';

export default class MediaEmbedResizeCommand extends Command {
	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();

		this.isEnabled = isMediaEmbed( element );

		if ( !element || !element.hasAttribute( 'width' ) ) {
			this.value = null;
		} else {
			this.value = {
				width: element.getAttribute( 'width' ),
				height: null
			};
		}
	}

	execute( options ) {
		const model = this.editor.model;
		const mediaElement = model.document.selection.getSelectedElement();

		model.change( writer => {
			writer.setAttribute( 'width', options.width, mediaElement );
		} );
	}
}
