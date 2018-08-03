/**
 * Internal dependencies
 */
import { withWeakMapCache } from '../utils';

/**
 * An object of properties describing a specific query.
 *
 * @typedef {WPQueriedDataQueryParts}
 *
 * @property {number} page      The query page (1-based index, default 1).
 * @property {number} perPage   Items per page for query (default 10).
 * @property {string} stableKey An encoded stable string of all non-pagination
 *                              query parameters.
 */

/**
 * Given a query object, returns an object of parts, including pagination
 * details (`page` and `perPage`, or default values). All other properties are
 * encoded into a stable (idempotent) `stableKey` value.
 *
 * @param {Object} query Optional query object.
 *
 * @return {WPQueriedDataQueryParts} Query parts.
 */
export function getQueryParts( query ) {
	/**
	 * @type {WPQueriedDataQueryParts}
	 */
	const parts = {
		stableKey: '',
		page: 1,
		perPage: 10,
	};

	// Ensure stable key by sorting keys. Also more efficient for iterating.
	const keys = Object.keys( query ).sort();

	for ( let i = 0; i < keys.length; i++ ) {
		const key = keys[ i ];
		const value = query[ key ];

		switch ( key ) {
			case 'page':
			case 'perPage':
				parts[ key ] = value;
				break;

			default:
				// While it's not required to be one, for simplicity's sake
				// mimic querystring encoding for stable key.
				parts.stableKey += (
					( parts.stableKey ? '&' : '' ) +
					encodeURIComponent( key ) +
					'=' +
					encodeURIComponent( value )
				);
		}
	}

	return parts;
}

export default withWeakMapCache( getQueryParts );