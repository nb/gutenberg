/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import RichText from '../../rich-text';
import './editor.scss';

export const name = 'core/trials';

const blockAttributes = {
	trials: {
		type: 'object',
		default:
			[
				{
					id: 1,
					title: 'Beautiful Gardens',
					description: 'Yes, they are, they are, they are',
					links: {
						p2: 'http://p2.com',
						github: 'http://dir.bg/',
					},
					status: 'next',
				},
			],
	},
};

class Trials extends Component {
	render() {
		const { className, attributes } = this.props;
		const { trials } = attributes;
		return (
			<div className={ className }>
				<h3>Next</h3>
				{ this.table( trials.filter( trial => 'next' === trial.status ) ) }
			</div>
		);
	}

	setTrialAttribute( id, attribute, value ) {
		const { attributes: { trials }, setAttributes } = this.props;
		const newTrials = trials.map( trial => ( id === trial.id ? { ...trial, [ attribute ]: value[ 0 ] } : trial ) );
		setAttributes( { trials: newTrials } );
	}

	richText( trial, attribute ) {
		const { edit, isSelected } = this.props;
		return edit ? ( <RichText tagName="span" placeholder={ __( 'Add…' ) } value={ [ trial[ attribute ] ] } onChange={ ( value ) => this.setTrialAttribute( trial.id, attribute, value ) } isSelected={ isSelected } /> ) : trial[ attribute ];
	}

	table( trials ) {
		return (
			<table>
				<tbody>
					<tr>
						<th>Title</th>
						<th>Description</th>
					</tr>
					{
						trials.map( trial => (
							<tr key={ trial.id }>
								<td>{ this.richText( trial, 'title' ) }</td>
								<td>{ this.richText( trial, 'description' ) }</td>
							</tr>
						) )
					}
				</tbody>
			</table>
		);
	}
}

export const settings = {
	title: __( 'Trials' ),

	description: __( 'List them buddy' ),

	icon: 'format-image',

	category: 'widgets',

	keywords: [ __( 'trials' ), __( 'hiring' ) ],

	attributes: blockAttributes,

	edit: ( props ) => ( <Trials edit={ true } { ...props } /> ),
	save: ( props ) => ( <Trials edit={ false } { ...props } /> ),
};
