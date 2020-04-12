import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import { normalizeMediaEmbedStyles } from './utils';

import '../theme/mediaembedstyle.css';

export default class MediaEmbedStyleUI extends Plugin {
	static get pluginName() {
		return 'MediaEmbedStyleUI';
	}

	get localizedDefaultStylesTitles() {
		const t = this.editor.t;

		return {
			'Full size media embed': t( 'Full size  media embed' ),
			'Side  media embed': t( 'Side  media embed' ),
			'Left aligned  media embed': t( 'Left aligned  media embed' ),
			'Centered  media embed': t( 'Centered  media embed' ),
			'Right aligned  media embed': t( 'Right aligned  media embed' )
		};
	}

	init() {
		const editor = this.editor;
		const configuredStyles = editor.config.get( 'mediaEmbed.styles' );

		const translatedStyles = translateStyles( normalizeMediaEmbedStyles( configuredStyles ), this.localizedDefaultStylesTitles );

		for ( const style of translatedStyles ) {
			this._createButton( style );
		}
	}

	_createButton( style ) {
		const editor = this.editor;

		const componentName = `mediaEmbedStyle:${ style.name }`;

		editor.ui.componentFactory.add( componentName, locale => {
			const command = editor.commands.get( 'mediaEmbedStyle' );
			const view = new ButtonView( locale );

			view.set( {
				label: style.title,
				icon: style.icon,
				tooltip: true,
				isToggleable: true
			} );

			view.bind( 'isEnabled' ).to( command, 'isEnabled' );
			view.bind( 'isOn' ).to( command, 'value', value => value === style.name );

			this.listenTo( view, 'execute', () => {
				editor.execute( 'mediaEmbedStyle', { value: style.name } );
				editor.editing.view.focus();
			} );

			return view;
		} );
	}
}

function translateStyles( styles, titles ) {
	for ( const style of styles ) {
		// Localize the titles of the styles, if a title corresponds with
		// a localized default provided by the plugin.
		if ( titles[ style.title ] ) {
			style.title = titles[ style.title ];
		}
	}

	return styles;
}
