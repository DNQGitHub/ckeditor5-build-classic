import Command from '@ckeditor/ckeditor5-core/src/command';
import { isMediaEmbed } from '../utils';

export default class MediaEmbedStyleCommand extends Command {
	constructor( editor, styles ) {
		super( editor );

		this.defaultStyle = false;

		this.styles = styles.reduce( ( styles, style ) => {
			styles[ style.name ] = style;

			if ( style.isDefault ) {
				this.defaultStyle = style.name;
			}

			return styles;
		}, {} );
	}

	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();

		this.isEnabled = isMediaEmbed( element );

		if ( !element ) {
			this.value = false;
		} else if ( element.hasAttribute( 'mediaEmbedStyle' ) ) {
			const attributeValue = element.getAttribute( 'mediaEmbedStyle' );
			this.value = this.styles[ attributeValue ] ? attributeValue : false;
		} else {
			this.value = this.defaultStyle;
		}
	}

	execute( options ) {
		const styleName = options.value;

		const model = this.editor.model;
		const mediaEmbedElement = model.document.selection.getSelectedElement();

		model.change( writer => {
			if ( this.styles[ styleName ].isDefault ) {
				writer.removeAttribute( 'mediaEmbedStyle', mediaEmbedElement );
			} else {
				writer.setAttribute( 'mediaEmbedStyle', styleName, mediaEmbedElement );
			}
		} );
	}
}
