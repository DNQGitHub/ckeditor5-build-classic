import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import WidgetResize from '@ckeditor/ckeditor5-widget/src/widgetresize';
import MediaEmbedResizeCommand from './mediaembedresize/mediaembedresizecommand';

import './theme/mediaembedresize.css';

export default class MediaEmbedResize extends Plugin {
	static get requires() {
		return [ WidgetResize ];
	}

	static get pluginName() {
		return 'MediaEmbedResize';
	}

	init() {
		const editor = this.editor;
		const command = new MediaEmbedResizeCommand( editor );

		this._registerSchema();
		this._registerConverters();

		editor.commands.add( 'mediaEmbedResize', command );

		editor.editing.downcastDispatcher.on( 'attribute:url:media', ( evt, data, conversionApi ) => {
			const widget = conversionApi.mapper.toViewElement( data.item );

			const resizer = editor.plugins
				.get( WidgetResize )
				.attachTo( {
					unit: editor.config.get( 'mediaEmbed.resizeUnit' ) || '%',
					modelElement: data.item,
					viewElement: widget,
					editor,

					getHandleHost( domWidgetElement ) {
						return domWidgetElement.querySelector( '.ck-media__wrapper' );
					},
					getResizeHost( domWidgetElement ) {
						return domWidgetElement;
					},
					// TODO consider other positions.
					isCentered() {
						// const imageStyle = data.item.getAttribute( 'imageStyle' );

						// return !imageStyle || imageStyle == 'full' || imageStyle == 'alignCenter';
						return false;
					},

					onCommit( newValue ) {
						editor.execute( 'mediaEmbedResize', { width: newValue } );
					}
				} );

			resizer.on( 'updateSize', () => {
				if ( !widget.hasClass( 'media_resized' ) ) {
					editor.editing.view.change( writer => {
						writer.addClass( 'media_resized', widget );
					} );
				}
			} );

			resizer.bind( 'isEnabled' ).to( command );
		}, { priority: 'low' } );
	}

	_registerSchema() {
		this.editor.model.schema.extend( 'media', {
			allowAttributes: 'width'
		} );
	}

	_registerConverters() {
		const editor = this.editor;

		// Dedicated converter to propagate image's attribute to the img tag.
		editor.conversion.for( 'downcast' ).add( dispatcher =>
			dispatcher.on( 'attribute:width:media', ( evt, data, conversionApi ) => {
				if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
					return;
				}

				const viewWriter = conversionApi.writer;
				const figure = conversionApi.mapper.toViewElement( data.item );

				if ( data.attributeNewValue !== null ) {
					viewWriter.setStyle( 'width', data.attributeNewValue, figure );
					viewWriter.addClass( 'media_resized', figure );
				} else {
					viewWriter.removeStyle( 'width', figure );
					viewWriter.removeClass( 'media_resized', figure );
				}
			} )
		);

		editor.conversion.for( 'upcast' )
			.attributeToAttribute( {
				view: {
					name: 'figure',
					styles: {
						width: /.+/
					}
				},
				model: {
					key: 'width',
					value: viewElement => viewElement.getStyle( 'width' )
				}
			} );
	}
}
