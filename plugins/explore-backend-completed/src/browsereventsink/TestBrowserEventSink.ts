import { createServer } from 'http';
import { Server } from 'socket.io';
import getPort from 'get-port';
import express from 'express';
import { ExploreTool } from '@backstage/plugin-explore-common';

export class TestBrowserEventSink {
  private static instance: Promise<TestBrowserEventSink>;

  static async get(): Promise<TestBrowserEventSink> {
    if (!this.instance) {
      this.instance = this.start();
    }
    return this.instance;
  }

  private static async start(): Promise<TestBrowserEventSink> {
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer);
    const port = await getPort();
    app.get('/', (req, res) => {
      res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dynamic Plugins Test Event sink</title>
          <style>
            body { margin: 0; padding-bottom: 3rem; font-family: sans-serif; }
            h2 { margin: 0; padding: 0.5rem 1rem; }
            h4 { margin: 0; padding: 0.5rem 1rem; }
            #messagesDiv {
              padding: 0.5rem;
              margin: 0.5rem;
              min-height: 50vh;
              background: #efefef;
            }
            #messages { list-style-type: none; margin: 0; padding: 0; width: 100%;}
            #messages > li { padding: 0.5rem 1rem; }
            #messages > li:nth-child(odd) { background: #f9f9f9; }
          </style>
        </head>
        <body>
          <h2>Messages sent as events to backstage and processed through dynamic plugins</h2>
          <h4>
            The messages below are received by the backstage backend through a new contributed http endpoint for the topic <code>test-dynamic-plugins</code>.<br/>
            They are then forwarded by another plugin to this browser sink through a <code>socket.io</code> connection.</br>
            All this is done through dynamic plugins only.<br/><br/>
            To send a message, use the <code>Send Message Event</code> template in backstage.
          </h4>
          <div id="messagesDiv">
            <ul id="messages"></ul>
          </div>
          <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
          <script>
            const socket = io();
            const messages = document.getElementById('messages');
            socket.on('event', (data) => {
              const item = document.createElement('li');
              item.textContent = data.text;
              messages.appendChild(item);
            });
          </script>                      
        </body>
      </html>      
      `);
    });

    httpServer.listen(port);
    return new TestBrowserEventSink(io, port);
  }

  private constructor(private io: Server, private port: number) {}

  get tool(): ExploreTool {
    return {
      title: 'Browser Event Sink',
      description:
        'A browser sink that displays messages sent from backstage as events through dynamic plugins',
      image:
        'https://material-icons.github.io/material-icons-png/png/black/sync/round-2x.png',
      url: `http://localhost:${this.port}`,
      lifecycle: 'experimental',
      tags: ['dynamic plugins', 'events', 'test'],
    };
  }

  sendEventToBrowser(event: unknown): void {
    this.io.emit('event', event);
  }
}
