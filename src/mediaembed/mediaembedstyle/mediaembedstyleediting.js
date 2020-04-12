import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MediaEmbedStyleCommand from './mediaembedstylecommand';
import { viewToModelStyleAttribute, modelToViewStyleAttribute } from './converters';
import { normalizeMediaEmbedStyles } from './utils';

export default class MediaEmbedStyleEditing extends Plugin {
	static get pluginName() {
		return 'MediaEmbedStyleEditing';
	}

	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const data = editor.data;
		const editing = editor.editing;

		// Define default configuration.
		editor.config.define( 'mediaEmbed.styles', [ 'full', 'side' ] );

		// Get configuration.
		const styles = normalizeMediaEmbedStyles( editor.config.get( 'mediaEmbed.styles' ) );

		// Allow mediaEmbedStyle attribute in media.
		schema.extend( 'media', { allowAttributes: [ 'mediaEmbedStyle', 'width' ] } );

		// Converters for mediaEmbedStyle attribute from model to view.
		const modelToViewConverter = modelToViewStyleAttribute( styles );
		editing.downcastDispatcher.on( 'attribute:mediaEmbedStyle:media', modelToViewConverter );
		data.downcastDispatcher.on( 'attribute:mediaEmbedStyle:media', modelToViewConverter );

		// Converter for figure element from view to model.
		data.upcastDispatcher.on( 'element:figure', viewToModelStyleAttribute( styles ), { priority: 'low' } );

		// Register mediaEmbedStyle command.
		editor.commands.add( 'mediaEmbedStyle', new MediaEmbedStyleCommand( editor, styles ) );
	}
}
