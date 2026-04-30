from __future__ import annotations

import socket
import sys
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import webview


PROJECT_DIR = Path(__file__).resolve().parent
ROOT_DIR = Path(getattr(sys, "_[ME]IPASS", PROJECT_DIR))


class SilentRequestHandler(SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:
        return


def find_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def start_server() -> tuple[ThreadingHTTPServer, str]:
    port = find_free_port()
    handler = partial(SilentRequestHandler, directory=str(ROOT_DIR))
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, f"http://127.0.0.1:{port}/index.html"


def main() -> None:
    server, url = start_server()

    try:
        webview.create_window(
            "Help Desk Simulator",
            url,
            width=1440,
            height=900,
            min_size=(960, 640),
            resizable=True,
        )
        webview.start(debug=True)
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    main()
