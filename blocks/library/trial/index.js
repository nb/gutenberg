/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Dropdown } from '@wordpress/components';

/**
 * Internal dependencies
 */
import RichText from '../../rich-text';
import './style.scss';
import './editor.scss';

export const name = 'core/trial';

const statuses = [ 'new', 'current', 'done' ];

const blockAttributes = {
	title: {
		source: 'children',
		selector: 'div > div:nth-child(2)',
	},
	description: {
		source: 'children',
		selector: 'div > div:nth-child(3)',
	},
	links: {
		source: 'children',
		selector: 'div > div:nth-child(4)',
	},
	status: {
		type: 'string',
		default: statuses[ 0 ],
	},
};

class Trial extends Component {
	render() {
		const { className } = this.props;
		return (
			<div className={ className }>
				<div>T:</div>
				<div>{ this.richText( 'title' ) }</div>
				<div>{ this.richText( 'description' ) }</div>
				<div>{ this.richText( 'links' ) }</div>
				<div>{ this.statusChooser() }</div>
			</div>
		);
	}

	richText( attribute ) {
		const { attributes, setAttributes, edit, isSelected } = this.props;
		return edit ? (
			<RichText
				tagName="span"
				placeholder={ __( `Add ${ attribute }…` ) }
				value={ attributes[ attribute ] }
				onChange={ ( value ) => setAttributes( { [ attribute ]: value } ) }
				isSelected={ isSelected }
				keepPlaceholderOnFocus
			/> ) :
			attributes[ attribute ];
	}

	statusChooser() {
		const { attributes, edit, className } = this.props;
		const { status } = attributes;
		return edit ? (
			<Dropdown
				contentClassName={ `${ className }-status-popover` }
				renderToggle={ ( { onToggle } ) => this.statusBadge( status, onToggle ) }
				renderContent={ () => this.allStatusBadges() }
			/> ) : this.statusBadge( status, () => {} );
	}

	statusBadge( status, onClick ) {
		return (
			<div key={ status } className={ `status-badge status-${ status }` } onClick={ onClick }>
				{ status }
			</div>
		);
	}

	allStatusBadges() {
		const { setAttributes } = this.props;
		return (
			<div>
				{ statuses.map( status => this.statusBadge( status, () => setAttributes( { status } ) ) ) }
			</div>
		);
	}
}

export const settings = {
	title: __( 'Trial Item' ),

	description: __( 'List it buddy' ),

	icon: 'format-image',

	category: 'widgets',

	keywords: [ __( 'trial' ), __( 'hiring' ) ],

	attributes: blockAttributes,

	edit: ( props ) => ( <Trial edit={ true } { ...props } /> ),
	save: ( props ) => ( <Trial edit={ false } { ...props } /> ),
};
