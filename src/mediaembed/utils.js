export function isMediaEmbed( modelElement ) {
	return !!modelElement && modelElement.is( 'media' );
}

export function isMediaEmbedWidget( viewElement ) {
	return !!viewElement.getCustomProperty( 'media' ) && isMediaEmbed( viewElement );
}

export function getSelectedMediaEmbedWidget( selection ) {
	const viewElement = selection.getSelectedElement();
	if ( viewElement && isMediaEmbedWidget( viewElement ) ) {
		return viewElement;
	}

	return null;
}
