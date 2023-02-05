import { HelloController } from "src/hello/hello.controller";
import { HelloService } from "src/hello/hello.service";

describe('HelloController', () => {
    let helloController: HelloController;
    let helloService: HelloService;
  
    beforeEach(() => {
        helloService = new HelloService();
        helloController = new HelloController(helloService);
    });
  
    describe('say hello', () => {
      it('should return hello world', async () => {
        const result = 'Hello World!';
        jest.spyOn(helloService, 'getHello').mockImplementation(() => result);
  
        expect(helloController.getHello()).toBe(result);
      });
    });
  });