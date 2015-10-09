from twisted.internet.protocol import Factory, Protocol
from twisted.internet import reactor
import os

mostRecentName = None

class TCPServer(Protocol):

	def connectionMade(self):
		self.factory.clients.append(self)
		print "Connected clients are ", self.factory.clients
		print "Connection from ", str(self.transport.getHost()) 

	def connectionLost(self, reason):
		self.factory.clients.remove(self)
		print "Client disconnected from ", self.transport.getPeer()

	def dataReceived(self, data):
		a = data
		print "Data Received = ", a
	
		if len(a) > 1:	# if data is a join message or command
 
			msg = ""
			if a[:3] == "iam":
				self.name = "app"
				print self.name + " has joined."
				msg = "K"
				self.transport.write(msg)
	
			elif a[:2] == "gb":
				self.name = "growbox"
				print self.name + " has joined."
				msg = ":"
				self.transport.write(msg)	

			elif a[:1] == ":":	# relay response data to app
				for c in self.factory.clients:
					if c.name == "app":
						c.transport.write(data)

			else:   # relay command to growbox
				for c in self.factory.clients:
					if c.name == "growbox":
						c.transport.write(data)	 
	 
		elif a == ":": 	# data is acknowledgement
			for c in self.factory.clients:
				if c.name == "app":
					c.transport.write(data)
		

 
#handle each connection established with the clients 
factory = Factory()
factory.protocol = TCPServer
factory.clients = []	#init clients array
reactor.listenTCP(420, factory)
print "Server started. Listening on port 80..."

#create twisted loop event
reactor.run()
