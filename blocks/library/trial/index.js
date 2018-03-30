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

const statuses = [
	{ key: 'new', text: 'New' },
	{ key: 'planned', text: 'Planned' },
	{ key: 'in-progress', text: 'In Progress' },
	{ key: 'needs-completion', text: 'Needs Completion' },
	{ key: 'needs-merging', text: 'Needs Merging' },
	{ key: 'done', text: 'Done :)' },
];

const blockAttributes = {
	title: {
		source: 'children',
		selector: 'header',
	},
	description: {
		source: 'children',
		selector: 'article',
	},
	team: {
		source: 'children',
		selector: 'address',
	},
	links: {
		source: 'children',
		selector: 'aside',
	},
	status: {
		type: 'object',
		default: statuses[ 0 ],
	},
};

class Trial extends Component {
	render() {
		const { className } = this.props;
		return (
			<div className={ className }>
				<header>{ this.richText( 'title' ) }</header>
				<div>
					<article>{ this.richText( 'description' ) }</article>
					<address>{ this.richText( 'team' ) }</address>
					<aside>{ this.richText( 'links' ) }</aside>
				</div>
				<footer style={ { clear: 'left' } }>{ this.statusChooser() }</footer>
			</div>
		);
	}

	richText( attribute ) {
		const { attributes, setAttributes, edit, isSelected } = this.props;
		return edit ? (
			<RichText
				key={ 1 }
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
		const { edit } = this.props;
		return (
			<span key={ status.key } className={ `status-badge status-${ status.key }` } onClick={ onClick }>
				{ status.text.replace( / /g, '\xa0' ) }
			</span>
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
