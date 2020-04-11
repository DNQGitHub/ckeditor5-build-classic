import Command from '@ckeditor/ckeditor5-core/src/command';

export default class MediaEmbedResizeCommand extends Command {
	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();

		this.isEnabled = !true; // true for attempt, should to detect is media or not

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
