import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class InsertImageUrl extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'insertImageUrl', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'Insert Image Url',
				icon: imageIcon,
				tooltip: true
			} );

			view.on( 'execute', () => {
				// eslint-disable-next-line no-undef, no-alert
				const imageUrl = prompt( 'Image Url' );

				editor.model.change( writer => {
					if ( imageUrl ) {
						const imageElement = writer.createElement( 'image', {
							src: imageUrl
						} );

						// Insert the image in the current selection location.
						editor.model.insertContent( imageElement, editor.model.document.selection );
					}
				} );
			} );

			return view;
		} );
	}
}
