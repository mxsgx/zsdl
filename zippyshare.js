const request = require( 'request-promise' );
const url = require( 'url' );
const dom = require( 'jsdom' ).JSDOM;
const express = require( 'express' );
const app = express();

if ( ! process.env.PORT ) {
	process.env.PORT = 3000;
}

async function getDirectURL( uri ) {
	var cookieJar = request.jar();
	var zippyshare = url.parse( uri );

	if ( zippyshare.hostname.search( 'zippyshare.com' ) < 0 ) {
		return {
			message: 'You kidding me? this is not zippyshare link.'
		};
	}

	var body = await request.get( {
		url: zippyshare.href,
		jar: cookieJar
	} );

	var window = new dom( body ).window;
	var scripts = window.document.body.querySelectorAll( 'script[type="text/javascript"]' );
	
	if ( ! scripts.length ) {
		return {
			message: 'File not found.'
		};
	}
	
	var name = window.document.head.querySelector( 'meta[property="og:title"]' );

	if ( name ) {
		name = name.getAttribute( 'content' );
	} else {
		return {
			message: 'There is no file name.'
		};
	}

	var id = /^\/v\/(?<id>.*?)\/file\.html$/;

	if ( id.test( zippyshare.pathname ) ) {
		id = id.exec( zippyshare.pathname ).groups.id;
	}

	var download;

	scripts.forEach( function( script ) {
		var content = script.textContent.toString().replace( /(\t{1,}|\s{2,}|\r|\n)/g, '' );
		var pattern = /^var\s+?a\s+?=\s+?(?<a>\d+)\;var\s+?b\s+?=\s+?(?<b>\d+)\;/;
		if ( pattern.test( content ) ) {
			var { a, b } = pattern.exec( content ).groups;
			var c = Math.floor( a / 3 );
			download = `https://${zippyshare.hostname}/d/${id}/${(c + a % b)}/${name}`;
		}
	} );

	return {
		url: download.trim()
	} || {
		message: 'No download file.'
	};
}

app.get( '/', async function( req, res ) {
	res.status( 200 );
	res.type( 'application/json' );

	if ( req.query.url ) {
		var data = await getDirectURL( req.query.url );

		if ( data.url && typeof req.query.no == 'undefined' ) {
			res.status( 302 );
			res.type( 'text/plain' );
			res.send( 'Redirecting to download file URL...' );
			res.redirect( data.url );
		}

		data.message = 'https://github.com/mxsgx/zsdl';

		res.end( JSON.stringify( data ) );
	} else {
		res.end( JSON.stringify( {
			message: 'https://github.com/mxsgx/zsdl'
		} ) );
	}
} );

app.listen( process.env.PORT, function() {
	console.log( `Success running on http://localhost:${process.env.PORT}` );
} );